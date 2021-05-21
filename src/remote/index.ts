import {
  Cartridge,
  WithServerStates,
  WithServerActions,
} from "../lib/socket/roomServer/types";
import type { SocketManager as ISocketManager } from "../lib/socket/manager";

export type CartStates = { type: "messages"; data: string[] };
export type CartActions = { type: "post"; data: string };
export type BotOptions = { backward: true };

export type States = WithServerStates<CartStates>;
export type Actions = WithServerActions<CartActions>;
export type SocketManager = ISocketManager<States, Actions>;

export const chatCartridge: Cartridge<CartStates, CartActions, BotOptions> = {
  shouldJoin: () => true,
  getInitialState: () => ({ type: "messages", data: [] }),
  isState: () => true,
  adaptState: (state) => state,
  reducer: (state, action, playerIndex) => {
    if (!action || action.type !== "post") return state;
    let message = `Player ${playerIndex}: ${action.data}!`;
    return {
      type: "messages",
      data: [...state.data, message],
    };
  },
  bot: (send, options) => (state, playerIndex) => {},
};
