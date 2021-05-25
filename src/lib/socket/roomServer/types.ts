export type Msg = {
  type: string;
  data?: any;
};

export type Bot<States> = (
  result: States,
  botPlayerIndex: number | undefined
) => void;

/** A collection respresenting the logic of a particular game type. */
export interface Cartridge<
  States extends Msg,
  Actions extends Msg,
  BotOptions extends {}
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
  createBot?: (
    send: (action: WithServerActions<Actions, BotOptions>) => void,
    close: () => void,
    options: BotOptions
  ) => Bot<WithServerStates<States>>;
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
export type ServerBotAction<BotOptions> = {
  type: "_bot";
  data: BotOptions;
};
export type ServerActions = ServerJoin;

export type WithServerStates<CartStates> = CartStates | ServerStates;
export type WithServerActions<CartActions, BotOptions> =
  | CartActions
  | ServerActions
  | ServerBotAction<BotOptions>;
