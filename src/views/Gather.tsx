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
  addBot: (options: any) => void;
  start: ({ backwards }: { backwards: boolean }) => void;
  exit: () => void;
};

export const Gather = ({ playerIndex, start, exit, addBot }: GatherProps) => {
  let [backwards, setBackwards] = useState(false);

  return (
    <Dialog>
      <GatherContainer>
        <div>You await as playerIndex {playerIndex}</div>
        <input
          type="checkbox"
          name="backward"
          onChange={(e) => {
            //@ts-ignore
            setBackwards(e.target.checked);
          }}
        />
        <label for="backward">Reverse messages</label>
        <br />
        <button onClick={() => start({ backwards })}>Open room</button>
        <button onClick={() => addBot({ trigger: "hi" })}>Add bot</button>
        <button onClick={exit}>Exit</button>
      </GatherContainer>
    </Dialog>
  );
};
