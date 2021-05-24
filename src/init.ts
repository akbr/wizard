import { chatCartridge } from "./remote";
import { initManager } from "./lib/socket/roomServer/initManager";
import { initState } from "./state/initState";
import { initGoober } from "./initGoober";
import { createViewFn } from "./lib/premix";
import { App } from "./views/App";

export function init() {
  const url =
    location.hostname !== "localhost"
      ? location.origin.replace(/^http/, "ws")
      : "ws://localhost:5000";

  const [manager] = initManager(chatCartridge, url);

  let [store] = initState(manager);

  initGoober();

  let updateView = createViewFn(App, document.getElementById("app")!);

  store.subscribe(updateView);
  updateView(store.getState());
}
