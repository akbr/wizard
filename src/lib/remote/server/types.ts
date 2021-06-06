import { Socket } from "../socket/types";

export interface Server<I, O> {
  onOpen: (socket: Socket<I, O>) => void;
  onClose: (socket: Socket<I, O>) => void;
  onAction: (socket: Socket<I, O>, action: I) => void;
}

// States
export type GameUpdate<GameStates> = {
  type: "game";
  data: GameStates;
};
export type GameError = {
  type: "gameError";
  data: string;
};
export type Room = {
  type: "room";
  data: {
    id: string;
    connections: (true | false)[];
    names: string[];
    playerIndex: number;
  };
};
export type ServerError = {
  type: "serverError";
  data: string;
};

export type WithServerStates<GameStates> =
  | GameUpdate<GameStates>
  | GameError
  | Room
  | ServerError;

//Actions
export type JoinAction = {
  type: "join";
  data: { id: string; playerIndex?: number };
};
export type StartAction<Options> = {
  type: "start";
  data: Options;
};
export type SubmitAction<GameActions> = {
  type: "submit";
  data: GameActions;
};
export type AddBotAction<BotOptions> = {
  type: "addBot";
  data: BotOptions;
};
export type WithServerActions<GameActions, Options, BotOptions> =
  | JoinAction
  | StartAction<Options>
  | SubmitAction<GameActions>
  | AddBotAction<BotOptions>;
