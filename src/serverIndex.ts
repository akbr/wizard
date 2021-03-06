import * as express from "express";
import * as path from "path";

import { createRoomServer } from "./lib/socket/roomServer";
import { mountRoomServer } from "./lib/socket/roomServer/expressMount";
import { chatCartridge } from "./remote";

const PORT = process.env.PORT || 5000;
const distPath = path.resolve("dist/");

mountRoomServer(
  express()
    .use(express.static(distPath))
    .get("/", function (_, res) {
      res.sendFile("index.html", { root: distPath });
    })
    .listen(PORT, function () {
      return console.log("Listening on " + PORT);
    })
)(createRoomServer(chatCartridge));
