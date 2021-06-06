/**
 * Summary
 */
export type Options = { canadian: boolean };
export type States = Deal | SelectTrump | Bid | Play | EndTrick | End;
export type Actions = SelectTrumpAction | BidAction | PlayAction;

/**
 * Substates
 */
type _Meta = {
  options: Options;
  numPlayers: number;
  scoreHistory: number[][];
};

type _TurnMeta = {
  turn: number;
  dealer: number;
};

type _Play = {
  hands: string[][];
  trumpCard: string | false;
  trumpSuit: string | undefined;
  bids: (number | false)[];
  actuals: number[];
};

type _Trick = {
  trick: string[];
  trickLeader: number;
};

type _Active = {
  activePlayer: number;
};

/**
 * States
 */
export type Start = _Meta & _TurnMeta; // Internal

export type Deal = _Meta &
  _TurnMeta & {
    phase: "deal";
  };

export type SelectTrump = _Meta &
  _TurnMeta &
  _Play &
  _Active & {
    phase: "selectTrump";
  };

export type Bid = _Meta &
  _TurnMeta &
  _Play &
  _Active & {
    phase: "bid";
  };

export type Play = _Meta &
  _TurnMeta &
  _Play &
  _Trick &
  _Active & {
    phase: "play";
  };

export type EndTrick = _Meta &
  _TurnMeta &
  _Play &
  _Trick & {
    phase: "endTrick";
    trickWinner: number;
  };

export type End = _Meta & {
  phase: "end";
};

/**
 * Actions
 */
export type SelectTrumpAction = {
  type: "selectTrump";
  data: string;
};

export type BidAction = {
  type: "bid";
  data: number;
};

export type PlayAction = {
  type: "play";
  data: string;
};

/**
 * Utilities
 */
export type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;
