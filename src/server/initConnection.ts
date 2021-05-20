import type { Server } from "../lib/socket/types";
import type { ServerStates, ServerActions } from "../lib/roomServer/types";
import type { ChatStates, ChatActions } from "./cartridge";
import type { SocketManager } from "../lib/socket/manager";

import { chatCartridge } from "./cartridge";
import { createRoomServer } from "../lib/roomServer";
import { createSocketManager } from "../lib/socket/manager";

export type States = ChatStates | ServerStates;
export type Actions = ChatActions | ServerActions;
export type ChatSocketManager = SocketManager<States, Actions>;

export function initConnection(): [
  SocketManager<States, Actions>,
  Server<States, Actions>
];
export function initConnection(url: string): SocketManager<States, Actions>;

export function initConnection(url?: string) {
  let server = url ? url : createRoomServer(chatCartridge);
  let socketManager = createSocketManager<States, Actions>(server);
  return url ? socketManager : ([socketManager, server] as const);
}
