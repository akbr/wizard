import { h } from "preact";
import { styled } from "goober";

const ErrScreen = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
  color: white
  padding: 0.25em;
`;

type Props = {
  msg: string;
  exit: () => void;
};

export const ServerErr = ({ msg, exit }: Props) => {
  return (
    <ErrScreen>
      <h3>Server error</h3>
      <div>{msg}</div>
      <button onClick={exit}>Exit</button>
    </ErrScreen>
  );
};
