import type { Socket } from "../socket/types";
import type { Server } from "./types";

function async(fn: () => unknown) {
  Promise.resolve().then(fn);
}

export function createLocalSocket<States, Actions>(
  server: Server<Actions, States>
) {
  let clientSocket: Socket<States, Actions>;
  let serverSocket: Socket<Actions, States>;
  let connected = false;

  clientSocket = {
    send: (action) => {
      if (!connected) throw new Error("Local socket not connected.");
      server.onAction(serverSocket, action);
    },
    close: () => server.onClose(serverSocket),
  };

  serverSocket = {
    send: (state) => {
      if (clientSocket.onmessage) clientSocket.onmessage(state);
    },
    close: () => {
      server.onClose(serverSocket);
      if (clientSocket.onclose) clientSocket.onclose();
    },
  };

  async(() => {
    connected = true;
    if (clientSocket.onopen) clientSocket.onopen();
  });

  return clientSocket;
}
