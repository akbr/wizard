import * as express from "express";
import { Server, WebSocket } from "ws";
import { Cartridge } from "./types";
import { createRoomServer } from "./";

const path = require("path");
const PORT = process.env.PORT || 1234;
const distPath = path.resolve("dist/");

function noop() {}

function heartbeat() {
  //@ts-ignore
  this.isAlive = true;
}

export function createNodeServer(cartridge: Cartridge<any, any, any>) {
  let server = express()
    .use(express.static(distPath))
    .get("/", function (_, res) {
      res.sendFile("index.html", { root: distPath });
    })
    .listen(PORT, function () {
      return console.log("Listening on " + PORT);
    });

  let gameServer = createRoomServer(cartridge);
  const wss = new Server({ server });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      //@ts-ignore
      if (ws.isAlive === false) return ws.terminate();
      //@ts-ignore
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 25000);

  function createRemote(wsss: typeof wss) {
    wsss.on("connection", function (ws) {
      let socket: any = {
        send: (msg: any) => ws.send(JSON.stringify(msg)),
      };

      //@ts-ignore
      ws.isAlive = true;
      //@ts-ignore
      ws.on("pong", heartbeat);

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
  }

  wss.on("close", function close() {
    clearInterval(interval);
  });

  createRemote(wss);
}
