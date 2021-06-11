import { createViewFn } from "./lib/premix";
import { Hand } from "./views/Hand";

let update = createViewFn(Hand, document.getElementById("app")!);

update({ hand: ["2|c", "3|c"] });
