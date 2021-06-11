import { CARD_W } from "./dimensions";

import { cardFactory } from "./cardFactory";
import { style } from "../../lib/style";

const X_PEEK = 35;
const Y_PEEK = 65;

function getRowInfo(width: number, numCards: number) {
  let maxInRow = Math.floor(width / X_PEEK);
  let numRows = Math.ceil(numCards / maxInRow);
  return { numRows, maxInRow };
}

export function getHandHeight(width: number, numCards: number) {
  let { numRows } = getRowInfo(width, numCards);
  return numRows * Y_PEEK;
}

function getHandPositions(hand: string[], { w, h }: { w: number; h: number }) {
  let { numRows, maxInRow } = getRowInfo(w, hand.length);
  let shortBy = numRows * maxInRow - hand.length;

  return hand.map((_, cardIndex) => {
    let rowNum = Math.trunc((cardIndex + shortBy) / maxInRow);
    let isFirstRow = rowNum === 0;
    if (!isFirstRow) cardIndex = cardIndex + shortBy;

    let pos = {
      x: (cardIndex % maxInRow) * X_PEEK,
      y: rowNum * Y_PEEK,
    };
    let numInRow = isFirstRow ? maxInRow - shortBy : maxInRow;

    let adj = w - (X_PEEK * (numInRow - 2) + CARD_W);
    if (adj > 0) pos.x += adj / 2;
    pos.y += h - numRows * Y_PEEK;
    return pos;
  });
}

export type HandUpdaterProps = {
  hand: string[];
  screen: { w: number; h: number };
};

export const handUpdater = (
  $el: HTMLElement,
  { hand, screen }: HandUpdaterProps
) => {
  $el.innerHTML = "";

  let positions = getHandPositions(hand, screen);
  let cardEls = cardFactory(hand);

  cardEls.forEach((el, idx) => {
    $el.appendChild(el);
    style(el, positions[idx]);
  });
};
