import {
  Cartridge,
  WithServerStates,
  WithServerActions,
} from "../lib/socket/roomServer/types";
import type { SocketManager as ISocketManager } from "../lib/socket/manager";

import { reducer, CartStates, CartActions } from "./reducer";
export type BotOptions = { backward: true };

export type States = WithServerStates<CartStates>;
export type Actions = WithServerActions<CartActions>;
export type SocketManager = ISocketManager<States, Actions>;

export const chatCartridge: Cartridge<CartStates, CartActions, BotOptions> = {
  shouldJoin: () => true,
  getInitialState: () => ({ type: "gather" }),
  isState: () => true,
  adaptState: (state) => state,
  reducer,
  bot: (send, options) => (state, playerIndex) => {},
};
