import type { States as ServerAndGameStates } from "../server/initConnection";

type AppStates = { type: "loading" } | { type: "title" };

export type States =
  | AppStates
  | Exclude<ServerAndGameStates, { type: "_room" }>;

export type Store = {
  connection: number;
  state: States;
  room?: Extract<ServerAndGameStates, { type: "_room" }>;
  // ---
  post: (msg: string) => void;
  join: (game: string, playerIndex?: number) => void;
  exit: () => void;
};
