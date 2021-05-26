import { TableDimensions, CARD_W, CARD_H } from "./measures";
import { Vector, add, multiply, invert } from "../lib/vector";

// Data
const tC = [0.5, 0];
const lC = [0, 0.5];
const lT = [0, 1 / 3];
const lB = [0, 2 / 3];
const rC = [1, 0.5];
const rT = [1, 1 / 3];
const rB = [1, 2 / 3];
const bC = [0.5, 1];

const ratios = [
  [bC],
  [bC, tC],
  [bC, lC, rC],
  [bC, lC, tC, rC],
  [bC, lB, lT, rT, rB],
  [bC, lB, lT, tC, rT, rB],
];

// Utilities
function getRatio(numPlayers: number, playerIndex: number): Vector {
  let [x, y] = ratios[numPlayers - 1][playerIndex];
  return { x, y };
}

const getSeatDirection = (numPlayers: number, playerIndex: number): Vector => {
  let { x, y } = getRatio(numPlayers, playerIndex);
  return x === 0
    ? { x: 1, y: 0 }
    : x === 1
    ? { x: -1, y: 0 }
    : y === 0
    ? { x: 0, y: 1 }
    : { x: 0, y: -1 };
};

const getCenterCardOffset = () => ({
  x: -CARD_W / 2,
  y: -CARD_H / 2,
});

// Creators

type VectorCreator = (
  numPlayers: number,
  playerIndex: number,
  tableDimensions: TableDimensions
) => Vector;

export const getSeatPosition: VectorCreator = (
  numPlayers,
  playerIndex,
  { tW, tH }
) => {
  let ratio = getRatio(numPlayers, playerIndex);
  let tableDimensions = { x: tW, y: tH };
  return multiply(ratio, tableDimensions);
};

export const getPlayedPoisition: VectorCreator = (
  numPlayers,
  playerIndex,
  tableDimensions
) => {
  let { tW, tH } = tableDimensions;
  let minYRatio = 0.33;

  let seat = getSeatPosition(numPlayers, playerIndex, tableDimensions);
  let direction = getSeatDirection(numPlayers, playerIndex);
  let playOffset = multiply(direction, { x: tW / 2, y: tH * minYRatio });
  let padding = multiply(invert(direction), { x: CARD_W + 12, y: CARD_H / 2 });
  let cardCenter = getCenterCardOffset();

  return add(seat, playOffset, padding, cardCenter);
};

export const getHeldPosition: VectorCreator = (
  numPlayers,
  playerIndex,
  tableDimensions
) => {
  let seat = getSeatPosition(numPlayers, playerIndex, tableDimensions);
  let direction = getSeatDirection(numPlayers, playerIndex);
  let heldOffset = multiply(invert(direction), { x: CARD_W, y: CARD_H });
  let cardCenter = getCenterCardOffset();

  return add(seat, heldOffset, cardCenter);
};
