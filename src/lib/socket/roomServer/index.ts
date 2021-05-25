import type { Server, ServerSocket } from "../types";
import type {
  Cartridge,
  WithServerStates,
  WithServerActions,
  Msg,
  Bot,
} from "./types";

import { createLocalSocketPair, async } from "../localSocketPair";

export function createRoomServer<
  CartStates extends Msg,
  CartActions extends Msg,
  BotOptions extends {}
>(
  cart: Cartridge<CartStates, CartActions, BotOptions>
): Server<
  WithServerStates<CartStates>,
  WithServerActions<CartActions, BotOptions>
> {
  // Types
  type AllStates = WithServerStates<CartStates>;
  type AllActions = WithServerActions<CartActions, BotOptions>;
  type ServerActions = Exclude<AllActions, CartActions>;

  type Socket = ServerSocket<AllStates>;
  type Room = {
    id: string;
    sockets: (Socket | false)[];
    names: string[];
    state: CartStates;
  };

  // Cartridge methods
  const {
    shouldJoin,
    getInitialState,
    reducer,
    isState,
    adaptState,
    createBot,
  } = cart;

  // Internal server state
  const socketRoomMap: Map<Socket, string | undefined> = new Map();
  const socketBotMap: Map<Socket, Bot<CartStates>> = new Map();
  const rooms: Map<string, Room> = new Map();

  // "Methods"
  function createRoom(id: string) {
    let room: Room = {
      id,
      sockets: [],
      state: getInitialState(),
      names: [],
    };
    rooms.set(id, room);
    return room;
  }

  function getSocketRoom(socket: Socket) {
    let roomId = socketRoomMap.get(socket);
    if (roomId) return rooms.get(roomId);
  }

  function broadcastRoomUpdate({ id, sockets, names }: Room) {
    let connections = sockets.map((s) => (s ? true : false));
    sockets.forEach((socket, playerIndex) => {
      if (socket)
        socket.send({
          type: "_room",
          data: {
            id,
            playerIndex,
            names,
            connections,
          },
        });
    });
  }

  function onJoinRoom(socket: Socket, room: Room, index?: number) {
    if (index === undefined) {
      room.sockets.push(socket);
    } else {
      room.sockets[index] = socket;
    }
    socketRoomMap.set(socket, room.id);
    broadcastRoomUpdate(room);
    socket.send(adaptState(room.state, room.sockets.indexOf(socket)));
  }

  function joinRoom(socket: Socket, id: string, requestedPlayerIndex?: number) {
    let room = rooms.get(id) || createRoom(id);
    let { state, sockets } = room;
    let numSeats = sockets.length;

    if (requestedPlayerIndex === undefined) {
      return shouldJoin(state, numSeats)
        ? onJoinRoom(socket, room)
        : `Could not join game ${id}.`;
    }

    if (requestedPlayerIndex !== undefined) {
      if (requestedPlayerIndex > numSeats) {
        return `Can't skip seats. Next seat is ${numSeats}`;
      }

      let seatOpen = !room.sockets[requestedPlayerIndex];
      return seatOpen
        ? onJoinRoom(socket, room, requestedPlayerIndex)
        : `Seat ${requestedPlayerIndex} is occupied`;
    }
  }

  function leaveRoom(socket: Socket) {
    let room = getSocketRoom(socket);
    if (room) {
      room.sockets = room.sockets.map((x) => (x === socket ? false : x));
      socketRoomMap.delete(socket);
      let roomIsEmpty =
        room.sockets.filter((x) => x && !socketBotMap.get(x)).length === 0;
      if (roomIsEmpty) {
        room.sockets.forEach((socket) => {
          if (socket) {
            socketBotMap.delete(socket);
            socketRoomMap.delete(socket);
          }
        });
        rooms.delete(room.id);
      }
      broadcastRoomUpdate(room);
    }
  }

  function broadcastState(room: Room) {
    room.sockets.forEach((socket, playerIndex) => {
      if (socket) socket.send(adaptState(room.state, playerIndex));
    });
  }

  function updateRoomStates(room: Room, socket?: Socket, action?: CartActions) {
    let { state } = room;
    let playerIndex = socket ? room.sockets.indexOf(socket) : -1;
    let nextState = reducer(state, action, playerIndex, room.sockets.length);

    if (nextState === state) {
      return;
    }

    if (isState(nextState)) {
      room.state = nextState;
    } else {
      if (socket) socket.send(nextState);
      return;
    }

    broadcastState(room);
    updateRoomStates(room);
  }

  function sendErr(socket: Socket, msg: string) {
    socket.send({
      type: "_err",
      data: { msg },
    });
  }

  function addBot(socket: Socket, botOptions: BotOptions) {
    if (!createBot) {
      return sendErr(
        socket,
        "This cartridge does not have a bot configuration."
      );
    }

    let roomId = socketRoomMap.get(socket);
    if (!roomId)
      return sendErr(socket, "You must be in a room to summon a bot.");

    let [clientSocket, serverSocket] = createLocalSocketPair(api);
    let send = (action: AllActions) => async(() => clientSocket.send(action));
    let bot = createBot(send, clientSocket.close, botOptions);
    socketBotMap.set(serverSocket, bot);
    clientSocket.onmessage = (state) => {
      let room = getSocketRoom(serverSocket);
      let playerIndex = room ? room.sockets.indexOf(serverSocket) : undefined;
      bot(state, playerIndex);
    };
    send({ type: "_join", data: { game: roomId } });
  }

  function onServerAction(socket: Socket, action: ServerActions) {
    if (action.type === "_join") {
      let { game, playerIndex } = action.data;
      if (typeof game !== "string") {
        return sendErr(socket, "Must specify a room id to data.");
      }
      if (
        typeof playerIndex !== "number" &&
        typeof playerIndex !== "undefined"
      ) {
        return sendErr(socket, "Invalid player number.");
      }
      leaveRoom(socket);
      let err = joinRoom(socket, game, playerIndex);
      if (err) sendErr(socket, err);
    }

    if (action.type === "_bot") {
      addBot(socket, action.data);
    }
  }

  function onAppAction(socket: Socket, action: CartActions) {
    let room = getSocketRoom(socket);
    return room
      ? updateRoomStates(room, socket, action)
      : sendErr(socket, "You are not in a game room.");
  }

  const isServerAction = (x: AllActions): x is ServerActions =>
    x.type[0] === "_";

  const api = {
    onOpen: (socket: Socket) => {},
    onClose: (socket: Socket) => {
      leaveRoom(socket);
    },
    onAction: (socket: Socket, action: AllActions) => {
      return isServerAction(action)
        ? onServerAction(socket, action)
        : onAppAction(socket, action as CartActions);
    },
  };

  return api;
}
