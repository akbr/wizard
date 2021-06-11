import type { Game } from "../lib/remote/game/types";
import type {
  WithServerStates,
  WithServerActions,
} from "../lib/remote/server/types";
import type { States, Actions, Options } from "./reducer/types";
import { start, reducer } from "./reducer";
import { createBot } from "./createBot";

export type WizardGame = Game<States, Actions, Options, {}>;

export type WizardServerStates = WithServerStates<States>;
export type WizardServerActions = WithServerActions<Actions, Options, {}>;

export const wizardGame: WizardGame = {
  numPlayers: [1, 6],
  start,
  reducer,
  createBot,
  adapt: (state, playerIndex) =>
    "hands" in state
      ? {
          ...state,
          hands: state.hands.map((hand, idx) =>
            playerIndex === idx ? hand : []
          ),
        }
      : state,
};
