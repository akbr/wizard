import { h } from "preact";
import { styled } from "goober";

const Panel = styled("div")`
  position: absolute;
  top: 0;
  right: 0;
  background-color: yellow;
  text-align: right;
  padding: 0.25em;
`;

type Props = {
  name: string;
  playerIndex: number;
  connections: any[];
};

export const RoomPanel = ({ name, connections, playerIndex }: Props) => {
  return (
    <Panel>
      <div>{name}</div>
      <div>You are player: {playerIndex}</div>
      <div>{JSON.stringify(connections)}</div>
    </Panel>
  );
};
