import type { Store, SocketManager } from "./types";

import createStore from "zustand/vanilla";
import { createHashEmitter, setHash, replaceHash } from "./hash";

export function initState(socket: SocketManager) {
  const store = createStore<Store>((set, get) => ({
    state: { type: "title" },
    connection: 0,
    post: (msg) => {
      socket.send({ type: "post", data: msg });
    },
    join: (game, playerIndex) => setHash(game, playerIndex),
    exit: () => {
      replaceHash();
      socket.closeSocket();
      set({ state: { type: "title" } });
    },
  }));

  let { setState } = store;

  socket.onStatus = (connection) => setState({ connection });

  socket.onData = (res) => {
    if (res.type === "_room") {
      setState({ room: res });
      replaceHash(res.data.id, res.data.playerIndex);
    } else if (res.type === "_err") {
      setState({ state: res });
    } else {
      setState({ state: res });
    }
  };

  createHashEmitter(({ game, playerIndex }) => {
    if (game !== undefined) {
      socket.openSocket();
      setState({ state: { type: "loading" } });
      socket.send({ type: "_join", data: { game, playerIndex } });
    } else {
      setState({ state: { type: "title" } });
    }
  });

  return store;
}
