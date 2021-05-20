import { combineAll } from "./utils";

export function standardDeck() {
  const suits = ["c", "h", "s", "d"];
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return combineAll(suits, values);
}

export function wizardDeck() {
  const suits = ["w", "j"];
  const values = [1, 2, 3, 4];
  return combineAll(suits, values);
}
