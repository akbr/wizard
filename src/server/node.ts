import { createNodeServer } from "../lib/roomServer/node";
import { chatCartridge } from "./cartridge";
createNodeServer(chatCartridge);
