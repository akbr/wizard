import {
  Cartridge,
  WithServerStates,
  WithServerActions,
} from "../lib/socket/roomServer/types";
import type { SocketManager } from "../lib/socket/manager";

import { reducer, CartStates, CartActions } from "./reducer";
export type BotOptions = { trigger: string };

export type ChatCartridge = Cartridge<CartStates, CartActions, BotOptions>;
export type States = WithServerStates<CartStates>;
export type Actions = WithServerActions<CartActions, BotOptions>;
export type ChatSocketManager = SocketManager<States, Actions>;

export const chatCartridge: ChatCartridge = {
  shouldJoin: () => true,
  getInitialState: () => ({ type: "gather" }),
  isState: () => true,
  adaptState: (state) => state,
  reducer,
  createBot: (send, close, options) => (state, playerIndex) => {
    if (state.type === "messages") {
      let lastMsg = state.data.messages[state.data.messages.length - 1];
      if (lastMsg) {
        if (lastMsg[1] === "echo") {
          send({ type: "post", data: "echo!! from player " + playerIndex });
        }
        if (lastMsg[1] === "die") {
          close();
        }
      }
    }
  },
};
