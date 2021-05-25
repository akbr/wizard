import { chatCartridge } from "./remote";
import { initManager } from "./lib/socket/roomServer/initManager";
import { initState } from "./state/initState";
import { initGoober } from "./initGoober";
import { createViewFn } from "./lib/premix";
import { App } from "./views/App";

export function init() {
  const isLocal = location.hostname === "localhost";
  const url = isLocal
    ? location.origin.replace(/^http/, "ws")
    : "ws://localhost:5000";

  const [manager] = initManager(chatCartridge, isLocal ? false : url);

  let [store, release, waitFor] = initState(manager);

  initGoober();

  let updateView = createViewFn(App, document.getElementById("app")!);

  store.subscribe((state) => {
    let tasks = updateView(state);
    tasks.forEach(waitFor);
    release();
  });
}
