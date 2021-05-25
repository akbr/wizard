import { h } from "preact";
import { createViewFn, WithUpdate } from "./lib/premix";

import { createFactory } from "./lib/cards/dom";
import { style } from "./lib/style";

import createStore from "zustand/vanilla";
import { createScreen } from "./emitters/screen";

let store = createStore(() => ({
  card: "2|d",
  screen: { w: 0, h: 0 },
}));
type Store = ReturnType<typeof store.getState>;
createScreen((screen) => store.setState({ screen }));

let factory = createFactory();

const update = ($el: HTMLElement, { card, screen }: Store) => {
  let { w, h } = screen;

  let [cardEl] = factory([card]);
  style(cardEl, { x: Math.random() * w, y: Math.random() * h });
  $el.appendChild(cardEl);
};

const View = (props: Store) => (
  <WithUpdate update={update} props={props}>
    <div />
  </WithUpdate>
);

export function dev() {
  let update = createViewFn(View, document.getElementById("app")!);
  update(store.getState());
  store.subscribe(update);
}
