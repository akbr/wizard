import type { ChatCartridge } from "./";

type GatherState = { type: "gather" };
export type Options = { backwards: boolean };
type Message = [number, string];
type MessagesState = {
  type: "messages";
  data: {
    options: Options;
    messages: Message[];
  };
};
export type CartStates =
  | GatherState
  | MessagesState
  | { type: "err"; data: string };

type StartAction = { type: "start"; data: Options };
type PostAction = { type: "post"; data: string };
export type CartActions = StartAction | PostAction;

export const reducer: ChatCartridge["reducer"] = (
  state,
  action,
  playerIndex
): CartStates => {
  if (!action || playerIndex === undefined) return state;

  switch (state.type) {
    case "gather": {
      if (action.type !== "start") return state;
      return onGather(state, action);
    }
    case "messages": {
      if (action.type !== "post") return state;
      return onMessages(state, action, playerIndex);
    }
  }

  return state;
};

function onGather(state: GatherState, action: StartAction): MessagesState {
  let options = action.data;

  return {
    type: "messages",
    data: {
      messages: [],
      options,
    },
  };
}

function onMessages(
  state: MessagesState,
  action: PostAction,
  playerIndex: number
): MessagesState {
  let { options, messages } = state.data;

  let msgString = action.data;

  if (options.backwards) {
    msgString = msgString.split("").reverse().join("");
  }

  let message: Message = [playerIndex, msgString];

  return {
    type: "messages",
    data: {
      messages: [...messages, message],
      options,
    },
  };
}
