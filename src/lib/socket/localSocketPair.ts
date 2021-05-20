import type { ClientSocket, ServerSocket, Server } from "./types";
import { async } from "./utils";

export function createLocalSocketPair<States, Actions>(
  server: Server<States, Actions>
) {
  let serverSocket: ServerSocket<States>;
  let clientSocket: ClientSocket<States, Actions>;

  serverSocket = {
    send: (state) => {
      if (clientSocket !== undefined)
        async(() => clientSocket.onmessage && clientSocket.onmessage(state));
    },
  };

  clientSocket = {
    readyState: 0,
    send: (action) => {
      if (clientSocket.readyState !== 1)
        throw new Error("Socket not in CONNECTED state.");
      server.onAction(serverSocket, action);
    },
    close: () => {
      server.onClose(serverSocket);
      clientSocket.readyState = 3;
      if (clientSocket.onclose) clientSocket.onclose();
    },
  };

  async(() => {
    server.onOpen(serverSocket);
    clientSocket.readyState = 1;
    if (clientSocket.onopen) clientSocket.onopen();
  });

  return [clientSocket, serverSocket] as const;
}
