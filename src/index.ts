import { chatCartridge } from "./remote";
import { initManager } from "./lib/socket/roomServer/initManager";
import { initState } from "./state/initState";
import { initView } from "./views/initView";

const url =
  location.hostname !== "localhost"
    ? location.origin.replace(/^http/, "ws")
    : "ws://localhost:5000";

const [manager] = initManager(chatCartridge, url);

let store = initState(manager);
let updateView = initView();

store.subscribe(updateView);
updateView(store.getState());
