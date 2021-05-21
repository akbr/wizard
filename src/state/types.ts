import { States as RemoteStates } from "../remote";
import { Screen } from "../emitters/screen";

type AppStates = { type: "loading" } | { type: "title" };

export type Store = {
  connection: number;
  state: AppStates | Exclude<RemoteStates, { type: "_room" }>;
  room?: Extract<RemoteStates, { type: "_room" }>;
  // ---
  screen: Screen;
  // ---
  post: (msg: string) => void;
  join: (game: string, playerIndex?: number) => void;
  exit: () => void;
};
