const SEPERATOR = "|";
const split = (cardId: string) => cardId.split(SEPERATOR);

export const getValue = (cardId: string) => parseInt(split(cardId)[0], 10);
export const getSuit = (cardId: string) => split(cardId)[1];
export const getTuple = (cardId: string): [number, string] => [
  getValue(cardId),
  getSuit(cardId)
];
export const combineAll = (
  suits: string[],
  values: number[],
  seperator: string
): string[] => {
  return suits.map((s) => values.map((v) => [v, s].join(seperator))).flat(1);
};

export function getStandardDeck() {
  const suits = ["c", "h", "s", "d"];
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return combineAll(suits, values, SEPERATOR);
}

export function getWizardDeck() {
  const suits = ["w", "j"];
  const values = [1, 2, 3, 4];
  return combineAll(suits, values, SEPERATOR);
}

export const shuffle = <T>(arr: T[]) => {
  let m = arr.length;
  let t: T;
  let i: number;
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
