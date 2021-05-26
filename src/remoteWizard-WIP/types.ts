export type Start = {
  type: "start";
  data: {
    activePlayer: number;
  };
};

export type GameData = {
  numPlayers: number;
  turn: number;
  activePlayer: number;
  dealer: number;
  hands: string[][];
  trumpCard: string | false;
  trumpSuit: string | undefined;
  bids: (number | false)[];
  actuals: number[];
  trick: string[];
  startPlayer: number;
  scoreHistory: number[][];
};

interface EndTrickData extends GameData {
  winner: number;
}

export type Init = {
  type: "init";
  data: GameData;
};

export type Bid = {
  type: "bid";
  data: GameData;
};

export type Trump = {
  type: "trump";
  data: GameData;
};

export type Play = {
  type: "play";
  data: GameData;
};

export type EndTrick = {
  type: "endTrick";
  data: EndTrickData;
};

export type End = {
  type: "end";
  data: GameData;
};

export type Err = {
  type: "err";
  data: { msg: string };
};

export type WizardStates = Start | Bid | Trump | Play | EndTrick | End | Err;

export type StartAction = {
  type: "start";
};

export type TrumpAction = {
  type: "trump";
  data: { cardId: string };
};

export type BidAction = {
  type: "bid";
  data: { bids: number };
};

export type PlayAction = {
  type: "play";
  data: { cardId: string };
};

export type WizardActions = StartAction | TrumpAction | BidAction | PlayAction;
