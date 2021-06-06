import createStore from "../lib/premix/zustand";
import { createHashEmitter, setHash, replaceHash } from "../emitters/hash";
import { createTransition } from "../emitters/withTransition";

import type { ChatSocketManager } from "../remote";
import { BotOptions, States as RemoteStates } from "../remote";
import { Options } from "../remote/reducer";
import { Transition } from "../emitters/withTransition";

type AppStates = { type: "loading" } | { type: "title" };

export type Store = {
  connection: number;
  state: AppStates | Exclude<RemoteStates, { type: "_room" }>;
  room?: Extract<RemoteStates, { type: "_room" }>;
  transition: Transition;
};

let [store, hook] = createStore<Store>(() => ({
  state: { type: "title" },
  connection: 0,
  transition: undefined,
}));

export const useStore = hook;

export type Actions = {
  addBot: (options: BotOptions) => void;
  start: (options: Options) => void;
  post: (msg: string) => void;
  join: (game: string, playerIndex?: number) => void;
  exit: () => void;
};

export const actions: Readonly<Actions> = {} as Actions;

export const init = (socket: ChatSocketManager) => {
  let { setState } = store;

  socket.onStatus = (connection) => setState({ connection });

  let { push, release, waitFor } = createTransition<Store["state"]>(
    ([state, transition]) => {
      setState({ state, transition });
    }
  );

  socket.onData = (res) => {
    if (res.type === "_room") {
      setState({ room: res });
      replaceHash(res.data.id, res.data.playerIndex);
    } else {
      push(res);
    }
  };

  createHashEmitter(({ game, playerIndex }) => {
    if (game !== undefined) {
      socket.openSocket();
      push({ type: "loading" });
      socket.send({ type: "_join", data: { game, playerIndex } });
    } else {
      push({ type: "title" });
    }
  });

  const actionsDef: Actions = {
    addBot: (data) => {
      socket.send({ type: "_bot", data });
    },
    start: (data) => {
      socket.send({ type: "start", data });
    },
    post: (data) => {
      socket.send({ type: "post", data });
    },
    join: (game, playerIndex) => setHash(game, playerIndex),
    exit: () => {
      replaceHash();
      socket.closeSocket();
      push({ type: "title" });
    },
  };

  Object.assign(actions, actionsDef);
};
