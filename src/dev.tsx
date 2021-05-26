import { h } from "preact";
import { createViewFn, WithUpdate } from "./lib/premix";

import { createFactory } from "./lib/cards/dom";

import createStore from "zustand/vanilla";
import { createScreen } from "./emitters/screen";
import { addDragListeners } from "./views/updaters/addDragListeners";

import { updateHand } from "./uiLogic/hand";

let hand = [
  "1|e",
  "2|d",
  "3|d",
  "4|d",
  "5|d",
  "6|d",
  "7|d",
  "8|d",
  "9|d",
  "2|c",
  "3|c",
  "4|c",
  "5|c",
  "6|c",
  "7|c",
  "8|c",
  "9|c",
  "2|h",
  "3|h",
  "4|h",
  "5|h",
  "6|h",
  "7|h",
  "8|h",
  "9|h",
  "1|w",
];

let store = createStore(() => ({
  hand,
  screen: { w: 0, h: 0 },
}));
type Store = ReturnType<typeof store.getState>;
createScreen((screen) => store.setState({ screen }));

const removeCard = (id: string) =>
  store.setState({
    hand: store.getState().hand.filter((x) => x !== id),
  });

let factory = createFactory();

const View = (props: Store) => (
  <WithUpdate update={updateHand} props={props}>
    <div />
  </WithUpdate>
);

export function dev() {
  let $app = document.getElementById("app")!;
  addDragListeners($app, removeCard);
  let update = createViewFn(View, $app);
  update(store.getState());
  store.subscribe(update);
}
