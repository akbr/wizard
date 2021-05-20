import { setup } from "goober";
import { h, render } from "preact";
import { App } from "./App";

export function initView() {
  setup(h);

  return function update(x: any) {
    render(h(App, x), document.getElementById("app")!);
  };
}
