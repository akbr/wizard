//import { init } from "./init";
//init();

import { wizardGame } from "./wizard";
import { createServer } from "./lib/remote/server";
import { createSocketManager } from "./lib/remote/server/socketManager";

let server = createServer(wizardGame);

let socket1 = createSocketManager(server);

socket1.onData = console.log;

socket1.openSocket();
socket1.send({ type: "join", data: { id: "test" } });
socket1.send({ type: "start", data: { canadian: false } });
