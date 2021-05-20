import { SEPERATOR } from "./utils";

const split = (cardId: string) => cardId.split(SEPERATOR);

export const getValue = (cardId: string) => parseInt(split(cardId)[0], 10);
export const getSuit = (cardId: string) => split(cardId)[1];
export const getTuple = (cardId: string): [number, string] => [
  getValue(cardId),
  getSuit(cardId),
];
