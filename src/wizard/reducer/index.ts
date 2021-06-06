import type { WizardGame } from "../";

import {
  createStart,
  createDeal,
  onDeal,
  onSelectTrump,
  onBid,
  onPlay,
  onEndTrick
} from "./reducerFns";

export const start: WizardGame["start"] = (numPlayers, options) =>
  createDeal(createStart(numPlayers, options));

export const reducer: WizardGame["reducer"] = (state, input) => {
  /**
   * Utility fns
   */
  const actionIsValid = () =>
    input &&
    "activePlayer" in state &&
    state.activePlayer === input.playerIndex &&
    state.phase === input.action.type;

  const actionErr = () =>
    `Waiting on ${input!.playerIndex} to submit a ${state.phase} action.`;

  /**
   * Waterfall
   */

  if (input) {
    if (state.phase === "selectTrump") {
      return actionIsValid()
        ? onSelectTrump(state, input!.action.data as string)
        : actionErr();
    }

    if (state.phase === "bid") {
      return actionIsValid()
        ? onBid(state, input!.action.data as number)
        : actionErr();
    }

    if (state.phase === "play") {
      return actionIsValid()
        ? onPlay(state, input!.action.data as string)
        : actionErr();
    }

    return `Invalid state.`;
  }

  if (!input) {
    if (state.phase === "deal") {
      return onDeal(state);
    }
    if (state.phase === "endTrick") {
      return onEndTrick(state);
    }

    if (state.phase === "end") {
      return state;
    }

    return state;
  }

  return `Something went very wrong.`;
};
