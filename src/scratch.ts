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
  type: "_error";
  data: string;
};
export type ReducerError = {
  type: "error";
  data: string;
};
export type Gather = {
  type: "_gather";
};
export type ServerStates = Room | ServerError;
export type WithServerStates<CartStates> = CartStates | ServerStates;

// Actions
export type ServerJoin = {
  type: "_join";
  data: { game: string; playerIndex?: number };
};
export type ServerStart<Options> = {
  type: "_start";
  data: Options;
};
export type ServerBotAction<BotOptions> = {
  type: "_addBot";
  data: BotOptions;
};
export type WithServerActions<CartActions, Options, BotOptions> =
  | CartActions
  | ServerJoin
  | ServerStart<Options>
  | ServerBotAction<BotOptions>;

export type Bot<States> = (
  result: States,
  botPlayerIndex: number | undefined
) => void;

export interface Cartridge<State, ClientEvents, Actions, Options, BotOptions> {
  maxPlayers: number;
  getInitialState: (options: Options) => State;
  reducer: (args: {
    state: State;
    action?: Actions;
    playerIndex: number;
    numPlayers: number;
  }) => State | ReducerError;
  adaptState: (state: State, playerIndex: number) => ClientEvents;
  createBot?: (
    send: (action: WithServerActions<Actions, Options, BotOptions>) => void,
    close: () => void,
    options: BotOptions
  ) => Bot<WithServerStates<ClientEvents>>;
}
