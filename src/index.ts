import { initConnection } from "./server/initConnection";
import { initState } from "./state/initState";
import { initView } from "./views/initView";

let manager =
  location.hostname !== "localhost"
    ? initConnection(location.origin.replace(/^http/, "ws"))
    : initConnection("ws://localhost:5000");

//let [manager, server] = initConnection();

let store = initState(manager);
let updateView = initView();

store.subscribe(updateView);
updateView(store.getState());
