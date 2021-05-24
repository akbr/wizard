import type { Store } from "../state/types";

import { h, Fragment } from "preact";

import { Title } from "./Title";
import { Messages } from "./Messages";
import { RoomPanel } from "./RoomPanel";
import { ServerErr } from "./ServerErr";

import { Gather } from "./Gather";

export const App = (props: Store) => {
  let { state, room, screen, start, post, exit, join } = props;

  if (state.type === "title") {
    return <Title join={join} />;
  }

  if (state.type === "gather" && room !== undefined) {
    let { id, connections, playerIndex } = room.data;
    return (
      <>
        <RoomPanel
          name={id}
          connections={connections}
          playerIndex={playerIndex}
        />
        <Gather playerIndex={playerIndex} start={start} />
      </>
    );
  }

  if (state.type === "messages" && room !== undefined) {
    let { id, connections, playerIndex } = room.data;
    return (
      <>
        <RoomPanel
          name={id}
          connections={connections}
          playerIndex={playerIndex}
        />
        <Messages messages={state.data.messages} post={post} exit={exit} />
      </>
    );
  }

  if (state.type === "_err") {
    return <ServerErr msg={state.data.msg} exit={exit} />;
  }
  return null;
};
