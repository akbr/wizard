import type { Socket } from "../socket/types";
import type { Game, Bot } from "../game/types";
import type { Server, WithServerStates, WithServerActions } from "./types";

export function createServer<GameStates, GameActions, Options, BotOptions>(
  game: Game<GameStates, GameActions, Options, BotOptions>
) {
  type AllStates = WithServerStates<GameStates>;
  type AllAction = WithServerActions<GameActions, Options, BotOptions>;

  type ServerSocket = Socket<AllAction, AllStates>;

  type Room = {
    id: string;
    sockets: (ServerSocket | false)[];
    names: string[];
    state: GameStates | false;
  };

  const { numPlayers, start, reducer, adapt = (x) => x, createBot } = game;

  const rooms: Map<string, Room> = new Map();
  const socketRooms: Map<ServerSocket, string> = new Map();
  const socketBots: Map<ServerSocket, Bot<GameStates>> = new Map();

  function createRoom(id: string) {
    let room: Room = {
      id,
      sockets: [],
      state: false,
      names: []
    };
    rooms.set(id, room);
    return room;
  }

  function getSocketRoom(socket: ServerSocket) {
    let roomId = socketRooms.get(socket);
    if (roomId) return rooms.get(roomId);
  }

  function broadcastRoomUpdate({ id, sockets, names }: Room) {
    let connections = sockets.map((s) => (s ? true : false));
    sockets.forEach((socket, playerIndex) => {
      if (socket)
        socket.send({
          type: "room",
          data: {
            id,
            playerIndex,
            names,
            connections
          }
        });
    });
  }

  function onJoinRoom(
    socket: ServerSocket,
    room: Room,
    requestedPlayerIndex?: number
  ) {
    if (requestedPlayerIndex === undefined) {
      let firstOpenSeat = room.sockets.indexOf(false);
      if (firstOpenSeat > -1) {
        room.sockets[firstOpenSeat] = socket;
      } else {
        room.sockets.push(socket);
      }
    } else {
      room.sockets[requestedPlayerIndex] = socket;
    }
    socketRooms.set(socket, room.id);
    broadcastRoomUpdate(room);

    if (room.state) {
      socket.send({
        type: "game",
        data: adapt(room.state, room.sockets.indexOf(socket))
      });
    }
  }

  function joinRoom(
    socket: ServerSocket,
    id: string,
    requestedPlayerIndex?: number
  ) {
    let room = rooms.get(id) || createRoom(id);
    let numSeats = room.sockets.length;

    if (requestedPlayerIndex === undefined) {
      let openSeats = room.sockets.indexOf(false) > -1;
      let roomForNewSeats = numSeats < numPlayers[1];

      return openSeats || roomForNewSeats
        ? onJoinRoom(socket, room)
        : `Could not join game ${id}: Seats are full.`;
    }

    if (requestedPlayerIndex !== undefined) {
      if (requestedPlayerIndex > numSeats) {
        return `Can't skip seats. Next seat is ${numSeats}`;
      }

      let seatOpen = room.sockets[requestedPlayerIndex] === false;
      return seatOpen
        ? onJoinRoom(socket, room, requestedPlayerIndex)
        : `Seat ${requestedPlayerIndex} is occupied`;
    }
  }

  function leaveRoom(socket: ServerSocket) {
    let room = getSocketRoom(socket);
    if (!room) return;

    room.sockets = room.sockets.map((x) => (x === socket ? false : x));
    socketRooms.delete(socket);

    let roomIsEmpty =
      room.sockets.filter((x) => x && !socketBots.get(x)).length === 0;

    if (roomIsEmpty) {
      room.sockets.forEach((socket) => {
        if (socket) {
          socketBots.delete(socket);
          socketRooms.delete(socket);
        }
      });
      rooms.delete(room.id);
    } else {
      broadcastRoomUpdate(room);
    }
  }

  function broadcastState(room: Room) {
    room.sockets.forEach((socket, playerIndex) => {
      if (socket && room.state)
        socket.send({ type: "game", data: adapt(room.state, playerIndex) });
    });
  }

  function updateRoomState(
    room: Room,
    socket?: ServerSocket,
    action?: GameActions
  ) {
    if (!room.state) return;

    let nextState: GameStates | string;

    if (socket && action) {
      let playerIndex = room.sockets.indexOf(socket);
      nextState = reducer(room.state, { action, playerIndex });
    } else {
      nextState = reducer(room.state);
    }

    if (typeof nextState === "string") {
      if (socket) socket.send({ type: "gameError", data: nextState });
      return;
    }

    if (room.state === nextState) return;

    room.state = nextState;

    broadcastState(room);
    updateRoomState(room);
  }

  function sendErr(socket: ServerSocket, msg: string) {
    socket.send({
      type: "serverError",
      data: msg
    });
  }

  function addBot(
    socket: ServerSocket,
    botOptions: BotOptions,
    api: Server<AllAction, AllStates>
  ) {
    if (!createBot) {
      return sendErr(
        socket,
        "This cartridge does not have a bot configuration."
      );
    }

    let botSocket: Socket<AllStates, AllAction>;
    let serverSocket: Socket<AllAction, AllStates>;

    botSocket = {
      send: (action) => api.onAction(serverSocket, action),
      close: () => api.onClose(serverSocket)
    };

    let bot = createBot(
      {
        send: (action) => botSocket.send({ type: "submit", data: action }),
        close: botSocket.close
      },
      botOptions
    );

    serverSocket = {
      send: (state) => {
        if (state.type !== "game") return;
        let room = getSocketRoom(serverSocket);
        let playerIndex = room ? room.sockets.indexOf(serverSocket) : undefined;
        bot(state.data, playerIndex);
      },
      close: () => api.onClose(serverSocket)
    };

    socketBots.set(serverSocket, bot);
    api.onAction(serverSocket, {
      type: "join",
      data: { id: socketRooms.get(socket)! }
    });
  }

  const api: Server<AllAction, AllStates> = {
    onOpen: (socket: ServerSocket) => {},
    onClose: (socket: ServerSocket) => {
      leaveRoom(socket);
    },
    onAction: (socket: ServerSocket, action: AllAction) => {
      if (action.type === "join") {
        let { id, playerIndex } = action.data;
        leaveRoom(socket);
        let err = joinRoom(socket, id, playerIndex);
        if (err) sendErr(socket, err);
      }

      let room = getSocketRoom(socket);
      if (!room) {
        return sendErr(socket, "You are not in a room");
      }
      let isPlayer0 = room.sockets.indexOf(socket) === 0;

      if (action.type === "start") {
        if (isPlayer0) {
          let numInRoom = room.sockets.length;
          if (numInRoom < numPlayers[0] || numInRoom > numPlayers[1]) {
            return sendErr(socket, "Invalid player number to start game.");
          }
          room.state = start(room.sockets.length, action.data);
          broadcastState(room);
          updateRoomState(room);
        } else {
          return sendErr(socket, "Only the room creator can start the game.");
        }
      }

      if (action.type === "addBot") {
        if (isPlayer0) {
          addBot(socket, action.data, api);
        } else {
          return sendErr(socket, "Only the room creator can add bots.");
        }
      }

      if (action.type === "submit") {
        updateRoomState(room, socket, action.data);
      }
    }
  };

  return api;
}
