import { States as RemoteStates } from "../remote";
import { Options } from "../remote/reducer";
import { Screen } from "../emitters/screen";
import { Transition } from "../emitters/withTransition";

type AppStates = { type: "loading" } | { type: "title" };

export type Store = {
  connection: number;
  state: AppStates | Exclude<RemoteStates, { type: "_room" }>;
  room?: Extract<RemoteStates, { type: "_room" }>;
  // ---
  transition: Transition;
  screen: Screen;
  // ---
  start: (options: Options) => void;
  post: (msg: string) => void;
  join: (game: string, playerIndex?: number) => void;
  exit: () => void;
};
