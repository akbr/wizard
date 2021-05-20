import * as express from "express";
import { Server } from "ws";
import { Cartridge } from "./types";
import { createRoomServer } from "./";
const path = require("path");
const PORT = process.env.PORT || 5000;

export function createNodeServer(cartridge: Cartridge<any, any, any>) {
  let server = express()
    .use(express.static(path.resolve("dist/")))
    .get("/", function (_, res) {
      res.sendFile("index.html", { root: path.resolve("dist/") });
    })
    .listen(PORT, function () {
      return console.log("Listening on " + PORT);
    });

  let gameServer = createRoomServer(cartridge);
  const wss = new Server({ server });

  function createRemote(wsss: typeof wss) {
    wsss.on("connection", function (ws) {
      let socket: any = {
        send: (msg: any) => ws.send(JSON.stringify(msg)),
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
  }

  createRemote(wss);
}
