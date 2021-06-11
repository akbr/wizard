import { initGoober } from "./initGoober";
import { createViewFn } from "./lib/premix";

import { wizardGame } from "./wizard";
import { createServer } from "./lib/remote/server";
import { createSocketManager } from "./lib/remote/server/socketManager";

initGoober();

let server = createServer(wizardGame);
let socket1 = createSocketManager(server);
