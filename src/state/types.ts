import { States as RemoteStates, Actions as RemoteActions } from "../remote";
import type { SocketManager as ISocketManager } from "../lib/socket/manager";

type AppStates = { type: "loading" } | { type: "title" };

export type SocketManager = ISocketManager<RemoteStates, RemoteActions>;

export type Store = {
  connection: number;
  state: AppStates | Exclude<RemoteStates, { type: "_room" }>;
  room?: Extract<RemoteStates, { type: "_room" }>;
  // ---
  post: (msg: string) => void;
  join: (game: string, playerIndex?: number) => void;
  exit: () => void;
};
