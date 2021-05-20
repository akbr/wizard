import "./styles.css";

import html from "./html";
import { cardView, backView, faceView, svgIcons } from "./templates";
import getSpec from "./getSpec";

function createCardEl(id?: string) {
  let info = id ? getSpec(id) : false;
  return info ? html(cardView(faceView(info))) : html(cardView(backView()));
}

export function createFactory() {
  let el = document.getElementById("cardsDomSvgIcons");
  if (!el) document.body.appendChild(html(svgIcons()));
  let faces: { [key: string]: HTMLElement } = {};

  function addCardEl(id: string) {
    let cardEl = createCardEl(id);
    cardEl.id = id;
    faces[id] = cardEl;
    return cardEl;
  }

  function getCardEl(id: string) {
    return faces[id] ? faces[id] : addCardEl(id);
  }

  function getBackEl() {
    // to do: cache these
    return createCardEl();
  }

  return function getEl(cardIds: (string | false)[]) {
    cardIds = Array.isArray(cardIds) ? cardIds : [cardIds];

    return cardIds.map((id, idx) =>
      id === false ? getBackEl() : getCardEl(id)
    );
  };
}

export type CardElFactory = ReturnType<typeof createFactory>;
