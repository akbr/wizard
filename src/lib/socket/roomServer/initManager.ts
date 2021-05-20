import type {
  WithServerStates,
  WithServerActions,
  Cartridge,
  Msg,
} from "./types";
import { createRoomServer } from ".";
import { createSocketManager } from "../manager";

export function initManager<CartStates extends Msg, CartActions extends Msg>(
  cartridge: Cartridge<CartStates, CartActions, any>,
  url: string | false
) {
  type States = WithServerStates<CartStates>;
  type Actions = WithServerActions<CartActions>;

  let server = url ? url : createRoomServer(cartridge);
  let socketManager = createSocketManager<States, Actions>(server);
  return [socketManager, server] as const;
}
