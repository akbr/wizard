import type { WizardServerStates, WizardServerActions } from "../wizard";
import type { SocketManager } from "../lib/remote/server/socketManager";

import createStore from "zustand/vanilla";

import { createHashEmitter, setHash, replaceHash } from "./hash";
import { createTransition, Transition } from "./withTransition";

type AppStates = { type: "loading" } | { type: "title" };

type Room = Extract<WizardServerStates, { type: "room" }>;
type Errors = Extract<
  WizardServerStates,
  { type: "gameError" } | { type: "serverError" }
>;
type State = AppStates | Exclude<WizardServerStates, Room | Errors>;

export type Store = {
  state: State;
  transition: Transition;
  room?: Room;
  error?: Errors;
  submit: (action: WizardServerActions) => void;
  exit: () => void;
};

export function initState(
  socket: SocketManager<WizardServerStates, WizardServerActions>
) {
  const store = createStore<Store>((set, get) => ({
    state: { type: "title" },
    connection: 0,
    screen: { w: 0, h: 0 },
    transition: undefined,
    submit: (action) => {
      if (action.type === "join") {
        setHash(action.data.id, action.data.playerIndex);
      } else {
        socket.send(action);
      }
    },
    exit: () => {
      replaceHash();
      socket.closeSocket();
      push({ type: "title" });
    },
  }));

  let { setState } = store;

  let { push, release, waitFor } = createTransition<Store["state"]>(
    ([state, transition]) => {
      setState({ state, transition });
    }
  );

  socket.onData = (res) => {
    if (res.type === "room") {
      setState({ room: res });
      replaceHash(res.data.id, res.data.playerIndex);
    } else if (res.type !== "gameError" && res.type !== "serverError") {
      push(res);
    }
  };

  createHashEmitter(({ game, playerIndex }) => {
    if (game !== undefined) {
      socket.openSocket();
      push({ type: "loading" });
      socket.send({ type: "join", data: { id: game, playerIndex } });
    } else {
      push({ type: "title" });
    }
  });

  return [store, release, waitFor] as const;
}
