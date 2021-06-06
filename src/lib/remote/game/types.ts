export interface Game<States, Actions, Options, BotOptions> {
  numPlayers: [number, number];
  start: (numPlayers: number, options: Options) => States;
  reducer: (
    state: States,
    input?: { action: Actions; playerIndex: number }
  ) => States | string;
  adapt?: (state: States, playerIndex: number) => States;
  createBot?: (
    socket: { send: (action: Actions) => void; close: () => void },
    options: BotOptions
  ) => Bot<States>;
}

export type Bot<States> = (
  state: States,
  botPlayerIndex: number | undefined
) => void;
