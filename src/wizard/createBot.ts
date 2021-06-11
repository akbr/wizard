import { WizardGame } from "./";
import { getPlayableCards } from "./reducer/logic";

export const createBot: WizardGame["createBot"] =
  (socket, options) => (state, playerIndex) => {
    if ("activePlayer" in state && state.activePlayer === playerIndex) {
      if (state.phase === "selectTrump") {
        socket.send({ type: "selectTrump", data: "h" });
      }
      if (state.phase === "bid") {
        socket.send({ type: "bid", data: 1 });
      }
      if (state.phase === "play") {
        let playableCards = getPlayableCards(
          state.hands[playerIndex],
          state.trick
        );
        socket.send({ type: "play", data: playableCards[0] });
      }
    }
  };
