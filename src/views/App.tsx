import type { Store } from "../state/types";

import { h, Fragment } from "preact";
import { WithUpdate } from "../lib/premix";
import { fade } from "./updaters/fade";

import { Title } from "./Title";
import { Messages } from "./Messages";
import { RoomPanel } from "./RoomPanel";
import { ServerErr } from "./ServerErr";

import { Gather } from "./Gather";

export const App = (props: Store) => {
  let { state, room, screen, start, post, exit, join, transition } = props;

  if (state.type === "title") {
    return (
      <WithUpdate update={fade} props={transition}>
        <Title join={join} />
      </WithUpdate>
    );
  }

  if (state.type === "err" || room === undefined) {
    return null;
  }

  let { id, connections, playerIndex } = room.data;

  let InteriorView =
    state.type === "gather" ? (
      <Gather playerIndex={playerIndex} start={start} exit={exit} />
    ) : state.type === "messages" ? (
      <Messages messages={state.data.messages} post={post} exit={exit} />
    ) : state.type === "loading" ? (
      <div>Loading...</div>
    ) : (
      <ServerErr msg={state.data.msg} exit={exit} />
    );

  return (
    <>
      <RoomPanel
        name={id}
        connections={connections}
        playerIndex={playerIndex}
      />
      {InteriorView}
    </>
  );
};
