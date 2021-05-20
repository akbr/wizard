import * as express from "express";
import * as path from "path";
import { createNodeServer } from "../lib/roomServer/node";
import { chatCartridge } from "./cartridge";

const PORT = process.env.PORT || 5000;
const distPath = path.resolve("dist/");

function createExpress() {
  return express()
    .use(express.static(distPath))
    .get("/", function (_, res) {
      res.sendFile("index.html", { root: distPath });
    })
    .listen(PORT, function () {
      return console.log("Listening on " + PORT);
    });
}

createNodeServer(createExpress())(chatCartridge);
