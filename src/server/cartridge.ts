import { Cartridge } from "../lib/roomServer/types";

export type ChatStates = { type: "messages"; data: string[] };
export type ChatActions = { type: "post"; data: string };
export type BotOptions = { backward: true };

export const chatCartridge: Cartridge<ChatStates, ChatActions, BotOptions> = {
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
