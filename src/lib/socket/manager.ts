import type { ClientSocket, Server } from "./types";
import { createLocalSocketPair } from "./localSocketPair";
import { createRemoteSocket } from "./remoteSocket";

export interface SocketManager<States, Actions> {
  openSocket: () => void;
  closeSocket: () => void;
  send: (action: Actions) => void;
  getStatus: () => number | false;
  onData: (result: States) => void;
  onStatus: (status: number) => void;
}

function noop() {}

export function createSocketManager<States, Actions>(
  server: Server<States, Actions> | string
) {
  let currentSocket: ClientSocket<States, Actions> | false = false;
  let sendBuffer: Actions[];
  let manager: SocketManager<States, Actions>;

  function openSocket() {
    if (currentSocket) manager.closeSocket();
    sendBuffer = [];

    let clientSocket =
      typeof server === "string"
        ? createRemoteSocket<States, Actions>(server)
        : createLocalSocketPair<States, Actions>(server)[0];

    clientSocket.onopen = () => {
      sendBuffer.forEach((action) => manager.send(action));
      manager.onStatus(clientSocket.readyState);
    };
    clientSocket.onclose = () => manager.onStatus(clientSocket.readyState);
    clientSocket.onmessage = (state) => manager.onData(state);
    manager.onStatus(clientSocket.readyState);
    currentSocket = clientSocket;
  }

  function closeSocket() {
    if (!currentSocket) return;
    currentSocket.close();
    currentSocket.onmessage = undefined;
    currentSocket = false;
  }

  function send(action: Actions) {
    if (!currentSocket) throw new Error("Socket manager has no open socket");
    if (currentSocket.readyState === 0) {
      sendBuffer.push(action);
    } else {
      currentSocket.send(action);
    }
  }

  function getStatus() {
    return currentSocket ? currentSocket.readyState : false;
  }

  manager = {
    openSocket,
    closeSocket,
    send,
    getStatus,
    onData: noop,
    onStatus: noop,
  };

  return manager;
}
