import type { ChatSocketManager } from "../remote";
import type { Store } from "./types";

import createStore from "zustand/vanilla";
import { createHashEmitter, setHash, replaceHash } from "../emitters/hash";
import { createScreen } from "../emitters/screen";
import { createTransition } from "../emitters/withTransition";

export function initState(socket: ChatSocketManager) {
  const store = createStore<Store>((set, get) => ({
    state: { type: "title" },
    connection: 0,
    screen: { w: 0, h: 0 },
    transition: undefined,
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
  }));

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

  createScreen((screen) => {
    setState({ screen });
  });

  setTimeout(() => {
    createHashEmitter(({ game, playerIndex }) => {
      if (game !== undefined) {
        socket.openSocket();
        push({ type: "loading" });
        socket.send({ type: "_join", data: { game, playerIndex } });
      } else {
        push({ type: "title" });
      }
    });
  }, 0);

  return [store, release, waitFor] as const;
}
