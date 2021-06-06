import type { Socket } from "../socket/types";
import { createWebSocket } from "../socket/websocket";
import { createLocalSocket } from "./localSocket";
import type { Server } from "./types";

export interface SocketManager<States, Actions> {
  openSocket: () => void;
  closeSocket: () => void;
  send: (action: Actions) => void;
  getStatus: () => boolean | undefined;
  onData: (result: States) => void;
  onStatus: (status: boolean) => void;
}

export function createSocketManager<States, Actions>(
  arg: Server<Actions, States> | string
) {
  let currentSocket: Socket<States, Actions> | false = false;
  let currentSocketStatus: boolean;
  let sendBuffer: Actions[];
  let manager: SocketManager<States, Actions>;

  function openSocket() {
    if (currentSocket) manager.closeSocket();

    sendBuffer = [];
    currentSocket =
      typeof arg === "string"
        ? createWebSocket<States, Actions>(arg)
        : createLocalSocket(arg);

    currentSocket.onopen = () => {
      currentSocketStatus = true;
      sendBuffer.forEach((action) => manager.send(action));
      manager.onStatus(true);
    };

    currentSocket.onclose = () => manager.onStatus(false);
    currentSocket.onmessage = (state) => manager.onData(state);
  }

  function closeSocket() {
    if (!currentSocket) return;
    currentSocket.close();
    currentSocket.onmessage = undefined;
    currentSocket = false;
    currentSocketStatus = false;
  }

  function send(action: Actions) {
    if (!currentSocket) throw new Error("Socket manager has no open socket");
    if (!currentSocketStatus) {
      sendBuffer.push(action);
    } else {
      currentSocket.send(action);
    }
  }

  function getStatus() {
    return currentSocket ? currentSocketStatus : undefined;
  }

  manager = {
    openSocket,
    closeSocket,
    send,
    getStatus,
    onData: () => undefined,
    onStatus: () => undefined
  };

  return manager;
}
