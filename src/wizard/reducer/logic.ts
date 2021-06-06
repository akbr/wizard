import { indexOfMax } from "./utils";
import {
  getValue,
  getSuit,
  getWizardDeck,
  getStandardDeck,
  shuffle,
  sortDeck
} from "./cardUtils";

export const getDealtCards = (numPlayers: number, numCards: number) => {
  let deck = shuffle([...getStandardDeck(), ...getWizardDeck()]);
  let handOrder = ["j", "s", "h", "c", "d", "w"];

  let hands = Array.from({ length: numPlayers })
    .map(() => {
      let hand = [];
      let i = 0;
      while (i < numCards) {
        hand.push(deck.pop());
        i++;
      }
      return hand;
    })
    .map((hand) => sortDeck(handOrder, hand));

  let trumpCard = deck.pop() || false;

  let trumpSuit =
    typeof trumpCard === "string" ? getSuit(trumpCard) : undefined;

  return {
    hands,
    trumpCard,
    trumpSuit
  };
};

export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const isValidSuit = (suit: string) =>
  ["h", "c", "s", "d"].includes(suit);

const winnerWithinSuit = (cards: string[], suit: string) => {
  let suits = cards.map(getSuit);
  let values = cards.map(getValue);
  let modValues = values.map((v, i) => (suits[i] === suit ? v : -1));
  return indexOfMax(modValues);
};

/**
 * Returns the first non-jester suit in the trick _or_ the jester suit if only jesters are present.
 * REMEMBER: Wizards count as a "suit.""
 */
const getLeadSuit = (trick: string[]) => {
  let suits = trick.map(getSuit);
  let firstNonJesterIndex = suits.findIndex((s) => s !== "j");
  return firstNonJesterIndex === -1 ? "j" : suits[firstNonJesterIndex];
};

export const getWinningIndex = (
  trick: string[],
  trumpSuit: string | undefined
) => {
  let suits = trick.map(getSuit);

  // First wizard wins
  let firstWizard = suits.indexOf("w");
  if (firstWizard !== -1) return firstWizard;

  // Highest trump wins
  if (trumpSuit && suits.indexOf(trumpSuit) !== -1) {
    return winnerWithinSuit(trick, trumpSuit);
  }

  let leadSuit = getLeadSuit(trick);

  // If all jesters, first jester wins
  if (leadSuit === "j") return 0;

  // Highest lead suit wins
  return winnerWithinSuit(trick, leadSuit);
};

export const getPlayableCards = (hand: string[], trick: string[]) => {
  if (trick.length === 0) return hand;

  let leadSuit = getLeadSuit(trick);

  if (leadSuit === "w" || leadSuit === "j") return hand;

  let suits = hand.map(getSuit);
  let leadSuitInHand = suits.indexOf(leadSuit) !== -1;

  if (!leadSuitInHand) return hand;

  let playableCardsWithLeadSuit = (_: any, i: number) =>
    suits[i] === "w" || suits[i] === "j" || suits[i] === leadSuit;

  return hand.filter(playableCardsWithLeadSuit);
};
