import type { Screen } from "./measures";
import {
  getTableDimensions,
  getRowInfo,
  X_PEEK,
  Y_PEEK,
  CARD_W,
} from "./measures";

import { cardFactory } from "./cardFactory";
import { style } from "../lib/style";

export function getHandPositions(hand: string[], screen: Screen) {
  let { tW, tH } = getTableDimensions(screen, hand.length);
  let { numRows, maxInRow } = getRowInfo(tW, hand.length);
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

    let adj = tW - (X_PEEK * (numInRow - 1) + CARD_W);
    if (adj > 0) pos.x += adj / 2;
    pos.y += screen.h - numRows * Y_PEEK;
    return pos;
  });
}

type UpdateHandProps = {
  screen: Screen;
  hand: string[];
};

export const updateHand = (
  $el: HTMLElement,
  { hand, screen }: UpdateHandProps
) => {
  $el.innerHTML = "";

  let positions = getHandPositions(hand, screen);
  let cardEls = cardFactory(hand);
  cardEls.forEach((el, idx) => {
    $el.appendChild(el);
    style(el, positions[idx], { duration: 200, easing: "ease" });
  });
};
