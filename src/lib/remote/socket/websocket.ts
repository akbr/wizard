import type { Socket } from "./types";

export function createWebSocket<States, Actions>(url: string) {
  let websocket = new WebSocket(url);

  let socket: Socket<States, Actions> = {
    send: (action) => {
      websocket.send(JSON.stringify(action));
    },
    close: () => websocket.close()
  };

  websocket.onopen = () => {
    if (socket.onopen) socket.onopen();
  };
  websocket.onclose = () => {
    if (socket.onclose) socket.onclose();
  };
  websocket.onmessage = (x) => {
    if (socket.onmessage) {
      let hydratedData = JSON.parse(x.data) as States;
      socket.onmessage(hydratedData);
    }
  };

  return socket;
}
