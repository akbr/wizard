import { Server } from "ws";
import { Cartridge } from "./types";
import { ServerSocket } from "../socket/types";
import { createRoomServer } from ".";

function addHeartbeat(wss: Server, ms = 25000) {
  function noop() {}
  function heartbeat() {
    //@ts-ignore
    this.isAlive = true;
  }

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      //@ts-ignore
      if (ws.isAlive === false) return ws.terminate();
      //@ts-ignore
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, ms);

  wss.on("connection", function (ws) {
    //@ts-ignore
    ws.isAlive = true;
    //@ts-ignore
    ws.on("pong", heartbeat);
  });

  wss.on("close", function close() {
    clearInterval(interval);
  });
}

export const mountRoomServer =
  (expressServer: Express.Application) =>
  (cartridge: Cartridge<any, any, any>) => {
    const gameServer = createRoomServer(cartridge);
    const wss = new Server({ server: expressServer as any });
    addHeartbeat(wss);

    wss.on("connection", function (ws) {
      const socket: ServerSocket<any> = {
        send: (msg) => ws.send(JSON.stringify(msg)),
      };

      gameServer.onOpen(socket);

      ws.on("message", function (msg: any) {
        if (typeof msg === "string") {
          let action = JSON.parse(msg);
          gameServer.onAction(socket, action);
        }
      });

      ws.on("close", function () {
        gameServer.onClose(socket);
      });
    });
  };
