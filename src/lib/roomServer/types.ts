export type Msg = {
  type: string;
  data?: any;
};

/** A collection respresenting the logic of a particular game type. */
export interface Cartridge<
  States extends Msg,
  Actions extends Msg,
  BotOptions = {}
> {
  /** Whether a new socket should be allowed to join as a player. (Does not include rejoins.) */
  shouldJoin: (state: States, numPlayers: number) => boolean;
  /** Get an initial game state */
  getInitialState: () => States;
  /** A reducer function */
  reducer: (
    state: States,
    action?: Actions,
    playerIndex?: number,
    numPlayers?: number
  ) => States;
  /** Whether this is a stable state for all players, or a response for one player. */
  isState: (result: States) => boolean;
  /** How to adapt the state on a per-player basis (e.g., to hide information.) */
  adaptState: (state: States, playerIndex: number) => States;
  /** A bot function */
  bot?: (
    send: (action: Actions) => void,
    options?: unknown
  ) => (result: States, botPlayerIndex: number) => void;
}

// States
export type Room = {
  type: "_room";
  data: {
    id: string;
    connections: (true | false)[];
    names: string[];
    playerIndex: number;
  };
};
export type ServerError = {
  type: "_err";
  data: {
    msg: string;
  };
};
export type ServerStates = Room | ServerError;

//Actions
export type ServerJoin = {
  type: "_join";
  data: { game: string; playerIndex?: number };
};
export type ServerActions = ServerJoin;
