import type {
  // Meta
  Options,
  // States
  Start,
  Deal,
  SelectTrump,
  Bid,
  Play,
  EndTrick,
  End,
  // Actions
  SelectTrumpAction,
  BidAction,
  PlayAction,
  ValidateShape,
} from "./types";

import { getDealtCards, getWinningIndex } from "./logic";
import { slideIndex, edit } from "./utils";

export const createStart = (numPlayers: number, options: Options): Start => ({
  numPlayers,
  options,
  scoreHistory: [],
  turn: 0,
  dealer: -1,
});

export const createDeal = (s: EndTrick | Start): Deal => ({
  phase: "deal",
  numPlayers: s.numPlayers,
  options: s.options,
  scoreHistory: s.scoreHistory,
  turn: s.turn + 1,
  dealer: s.dealer + 1,
});

export const onDeal = (s: Deal): SelectTrump | Bid => {
  let nextCards = getDealtCards(s.numPlayers, s.turn);
  let wizardTrump = nextCards.trumpSuit === "w";
  if (wizardTrump) nextCards.trumpSuit = undefined;

  return {
    ...s,
    phase: wizardTrump ? "selectTrump" : "bid",
    ...nextCards,
    bids: Array.from({ length: s.numPlayers }, () => false) as (
      | number
      | false
    )[],
    actuals: Array.from({ length: s.numPlayers }, () => 0),
    activePlayer: wizardTrump ? s.dealer : slideIndex(s.numPlayers, s.dealer),
  };
};

export const onSelectTrump = (
  s: SelectTrump,
  suit: SelectTrumpAction["data"]
): Bid => ({
  ...s,
  phase: "bid",
  trumpSuit: suit,
  activePlayer: slideIndex(s.numPlayers, s.dealer),
});

export const onBid = (s: Bid, bid: BidAction["data"]) => {
  bid = Math.round(bid);

  let bids = edit(s.bids, (bids) => {
    bids[s.activePlayer] = bid;
  });

  let bidsRemain = bids.includes(false);

  return bidsRemain
    ? <Bid>{
        ...s,
        phase: "bid",
        bids,
        activePlayer: slideIndex(s.numPlayers, s.activePlayer),
      }
    : <Play>{
        ...s,
        phase: "play",
        bids,
        activePlayer: slideIndex(s.numPlayers, s.dealer),
        trick: [],
        trickLeader: slideIndex(s.numPlayers, s.dealer),
      };
};

export const onPlay = (
  s: Play,
  cardId: PlayAction["data"]
): Play | EndTrick | string => {
  if (s.hands[s.activePlayer].indexOf(cardId) === -1) {
    return "Cheater! You don't have that card!";
  }

  const hands = edit(s.hands, (hands) => {
    let activeHand = hands[s.activePlayer];
    activeHand.splice(activeHand.indexOf(cardId), 1);
  });

  const trick = [...s.trick, cardId];

  let trickComplete = trick.length === s.numPlayers;

  if (!trickComplete) {
    return {
      ...s,
      hands,
      trick,
      activePlayer: slideIndex(s.numPlayers, s.activePlayer),
    };
  }

  let winningIndex = getWinningIndex(trick, s.trumpSuit);
  let trickWinner = slideIndex(s.numPlayers, winningIndex, s.trickLeader);

  let { activePlayer, ...t } = s;
  let result = {
    ...t,
    phase: "endTrick",
    hands,
    trick,
    trickWinner,
  } as const;
  let endTrick: ValidateShape<typeof result, EndTrick> = result;
  return endTrick;
};

export const onEndTrick = (s: EndTrick): Deal | End => {
  const actuals = edit(s.actuals, (actuals) => {
    actuals[s.trickWinner] += 1;
  });
  const scoreHistory = edit(s.scoreHistory, (scoreHistory) => {
    scoreHistory.push(s.bids as number[], actuals);
  });

  let gameIsOver = s.turn * s.numPlayers === 60;

  return gameIsOver
    ? {
        phase: "end",
        options: s.options,
        numPlayers: s.numPlayers,
        scoreHistory,
      }
    : createDeal({
        ...s,
        scoreHistory,
      });
};
