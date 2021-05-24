import { h } from "preact";
import { useState } from "preact/hooks";
import { Dialog } from "./Dialog";
import { styled } from "goober";

const GatherContainer = styled("div")`
  background-color: pink;
  padding: 1em;
`;

type GatherProps = {
  playerIndex: number;
  start: ({ backwards }: { backwards: boolean }) => void;
};

export const Gather = ({ playerIndex, start }: GatherProps) => {
  let [backwards, setBackwards] = useState(false);

  return (
    <Dialog>
      <GatherContainer>
        <div>You await as playerIndex {playerIndex}</div>
        <input
          type="checkbox"
          name="vehicle1"
          onChange={(e) => {
            //@ts-ignore
            setBackwards(e.target.checked);
          }}
        />
        <label for="vehicle1">Reverse messages</label>
        <br />
        <button onClick={() => start({ backwards })}>Open room</button>
        <button>Exit</button>
      </GatherContainer>
    </Dialog>
  );
};
