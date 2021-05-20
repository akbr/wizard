import type { ClientSocket } from "./types";

export function createRemoteSocket<States, Actions>(url: string) {
  let websocket = new WebSocket(url);

  let clientSocket: ClientSocket<States, Actions> = {
    readyState: 0,
    send: (action) => {
      websocket.send(JSON.stringify(action));
    },
    close: () => websocket.close(),
  };

  function updateReadyState() {
    clientSocket.readyState = websocket.readyState;
  }

  websocket.onopen = () => {
    updateReadyState();
    if (clientSocket.onopen) clientSocket.onopen();
  };
  websocket.onclose = () => {
    updateReadyState();
    if (clientSocket.onclose) clientSocket.onclose();
  };
  websocket.onmessage = (x) => {
    if (clientSocket.onmessage) {
      clientSocket.onmessage(JSON.parse(x.data) as States);
    }
  };

  return clientSocket;
}
