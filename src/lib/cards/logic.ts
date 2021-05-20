import { getValue, getSuit } from "./core/helpers";

export const shuffle = (arr: string[]) => {
  let m = arr.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

type Sorted = { [key: string]: string[] };

const getSortedSuits = (deck: string[]) => {
  let sorted = deck.reduce((acc, curr) => {
    let suit = getSuit(curr);
    if (!acc[suit]) acc[suit] = [];
    acc[suit].push(curr);
    return acc;
  }, {} as Sorted);
  for (let key in sorted) {
    sorted[key] = sorted[key].sort((a, b) => getValue(a) - getValue(b));
  }
  return sorted;
};

const mergeSortedDeck = (sorted: Sorted, suitOrder: string[]): string[] => {
  let deck: string[] = [];

  suitOrder.forEach((suit) => {
    if (sorted[suit]) deck.push(...sorted[suit]);
  });
  return deck;
};

export const sortDeck = (
  suitOrder = ["s", "h", "c", "d"],
  cardIds: string[]
) => {
  let sorted = getSortedSuits(cardIds);
  return mergeSortedDeck(sorted, suitOrder);
};
