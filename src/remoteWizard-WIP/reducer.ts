import {
  WizardActions,
  WizardStates,
  Start,
  Trump,
  Bid,
  Play,
  EndTrick,
  End,
  Err,
} from "./types";

import {
  getDealtCards,
  getWinningIndex,
  isValidSuit,
  randomInt,
} from "./logic";

import { slideIndex } from "../lib/array";

export function getInitialState(): Start {
  return { type: "start", data: { activePlayer: 0 } };
}

export function reducer(
  state: WizardStates,
  action?: WizardActions,
  playerIndex?: number,
  numPlayers?: number
): WizardStates {
  if (action === undefined) {
    if (state.type === "endTrick") {
      return state;
    }
    return state;
  }

  if (state.type === "err") return state;

  if (playerIndex !== state.data.activePlayer) {
    return error(`Invalid player.`);
  }

  switch (state.type) {
    case "start":
      return state.type === action.type
        ? onStart(numPlayers as number)
        : mistmatchError(state.type);
    case "trump":
      return state.type === action.type
        ? onTrump(clone(state), action.data.cardId)
        : mistmatchError(state.type);
    case "bid":
      return state.type === action.type
        ? onBid(clone(state), action.data.bids)
        : mistmatchError(state.type);
    case "play":
      return state.type === action.type
        ? onPlay(clone(state), action.data.cardId)
        : mistmatchError(state.type);
  }

  return error("Got to the end of the reducer somehow?");
}

function clone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

function error(msg: string): Err {
  return {
    type: "err",
    data: { msg },
  };
}

function mistmatchError(type: string) {
  return error(`Expected action type ${type}.`);
}

// ---

function onStart(numPlayers: number) {
  if (numPlayers < 2) return error("You need someone to play with!");
  if (numPlayers > 6) return error("Too many players!");

  return nextTurn({
    type: "play",
    data: {
      numPlayers,
      turn: 0,
      activePlayer: 0,
      dealer: randomInt(0, numPlayers - 1),
      startPlayer: 0,
      hands: [],
      trumpCard: "",
      trumpSuit: "",
      bids: [],
      actuals: [],
      trick: [],
      scoreHistory: [],
    },
  });
}

function nextTurn({ data }: Play) {
  let { turn, numPlayers, dealer } = data;

  data = {
    ...data,
    ...getDealtCards(numPlayers, turn),
    turn: turn + 1,
    dealer: slideIndex(numPlayers, dealer),
    bids: Array.from({ length: numPlayers }, () => false),
    actuals: Array.from({ length: numPlayers }, () => 0),
  };

  let type: "trump" | "bid";
  if (data.trumpSuit === "w") {
    type = "trump";
    data.activePlayer = dealer;
  } else {
    type = "bid";
    data.activePlayer = slideIndex(numPlayers, dealer);
  }

  return {
    type,
    data,
  };
}

function onTrump({ data }: Trump, trumpSuit: string): Bid | Err {
  if (!isValidSuit(trumpSuit)) {
    return error("Invalid suit.");
  }

  data.trumpSuit = trumpSuit;
  data.activePlayer = slideIndex(data.numPlayers, data.dealer);

  return {
    type: "bid",
    data,
  };
}

function onBid({ data }: Bid, numBid: number): Bid | Play | Err {
  numBid = Math.round(numBid);
  let isValidBid =
    typeof numBid === "number" && numBid >= 0 && numBid <= data.turn;
  if (!isValidBid) {
    return error("Invalid bid.");
  }

  let { numPlayers, bids, activePlayer, dealer } = data;

  bids[activePlayer] = numBid;

  let type: "bid" | "play";
  if (bids.includes(false)) {
    type = "bid";
    data.activePlayer = slideIndex(numPlayers, activePlayer);
  } else {
    type = "play";
    data.activePlayer = slideIndex(numPlayers, dealer);
  }

  return {
    type,
    data,
  };
}

function onPlay(state: Play, cardId: string) {
  let { hands, trick, activePlayer, numPlayers } = state.data;

  const activeHand = hands[activePlayer];
  const cardIndex = activeHand.indexOf(cardId);

  if (cardIndex === -1) {
    return error("Cheater! You don't have that card!");
  }

  trick.push(cardId);
  activeHand.splice(cardIndex, 1);

  let moreCardsInTrick = trick.length !== numPlayers;
  if (moreCardsInTrick) {
    state.data.activePlayer = slideIndex(numPlayers, activePlayer);
    return state;
  } else {
    return endTrick(state);
  }
}

function endTrick(state: Play) {
  let { data } = state;
  let {
    numPlayers,
    activePlayer,
    hands,
    turn,
    trick,
    trumpSuit,
    actuals,
    scoreHistory,
  } = data;

  let winningIndex = getWinningIndex(trick, trumpSuit);
  let trickLeader = slideIndex(numPlayers, activePlayer);
  let winner = slideIndex(numPlayers, winningIndex, trickLeader);

  actuals[winner] += 1;
  scoreHistory.push(data.bids as number[], actuals);
  data.activePlayer = winner;
  data.trick = [];

  let gameIsOver = turn * numPlayers === 60;
  if (gameIsOver) {
    return {
      type: "end",
      data,
    } as End;
  }

  let turnIsOver = hands[0].length === 0;
  return turnIsOver ? nextTurn(state) : state;
}
