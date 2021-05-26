import type { TableDimensions } from "./measures";
import { slideIndex } from "../lib/array";
import { style } from "../lib/style";
import { cardFactory } from "./cardFactory";
import { getPlayedPoisition, getHeldPosition } from "./vectors";

type Props = {
  tableDimensions: TableDimensions;
  playerIndex: number;
  numPlayers: number;
  startPlayer: number;
  trick: string[];
  winner?: number;
};

export function playUpdate(
  $root: HTMLElement,
  { tableDimensions, startPlayer, numPlayers, playerIndex, trick }: Props,
  prev?: Props
) {
  const endIndex = trick.length - 1;
  const prevCards = trick.slice(0, endIndex);
  const nextCard = trick[endIndex];

  const getAdjustedPlayerIndex = (i: number) =>
    slideIndex(numPlayers, i, startPlayer - playerIndex);

  const playedPositions = trick.map((_, i) =>
    getPlayedPoisition(numPlayers, getAdjustedPlayerIndex(i), tableDimensions)
  );

  cardFactory(prevCards).forEach((cardEl, i) => {
    $root.appendChild(cardEl);
    style(cardEl, playedPositions[i]);
  });

  cardFactory([nextCard]).forEach((cardEl) => {
    let heldPosition = getHeldPosition(
      numPlayers,
      getAdjustedPlayerIndex(endIndex),
      tableDimensions
    );
    $root.appendChild(cardEl);
    style(cardEl, heldPosition);
    style(cardEl, playedPositions[endIndex], {
      duration: 1000,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  });

  /**
   *   let onlyResize = props === prev;
  if (onlyResize) {
    // position all
  }

  empty($root);

  let isWinner = props.winner !== undefined;
  if (isWinner) {
    // position all
    // animate winner
  }

  if (prevProps === undefined) {
    // position all
  }

  // position all but last
  // animate in last
   */
}
