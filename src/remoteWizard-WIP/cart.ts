/**
 * 
 * import { Cartridge } from "../roomServer/types";
import { WizardStates, WizardActions } from "./types";
import { reducer, getInitialState } from "./reducer";

function clone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

export const wizardCartridge: Cartridge<WizardStates, WizardActions> = {
  shouldJoin: (state, numPlayers) =>
    state.type === "start" && numPlayers < 6 ? true : false,
  getInitialState,
  reducer,
  isState: (result) => (result.type !== "err" ? true : false),
  adaptState: (state, playerIndex) => {
    if (state.type === "start" || state.type === "err") return state;
    let adaptedState = clone(state);
    adaptedState.data.hands = state.data.hands.map((hand, i) =>
      i === playerIndex ? hand : []
    );
    return adaptedState;
  },
};

 */
