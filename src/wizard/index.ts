import type { Game } from "../lib/remote/game/types";
import type {
  WithServerStates,
  WithServerActions,
} from "../lib/remote/server/types";
import type { States, Actions, Options } from "./reducer/types";
import { start, reducer } from "./reducer";

export type WizardGame = Game<States, Actions, Options, {}>;

export type WizardServerStates = WithServerStates<States>;
export type WizardServerActions = WithServerActions<Actions, Options, {}>;

export const wizardGame: WizardGame = {
  numPlayers: [2, 6],
  start,
  reducer,
};
