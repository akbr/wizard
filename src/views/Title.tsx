import { h } from "preact";
import { useRef, Ref } from "preact/hooks";
import { styled } from "goober";

const TitleDiv = styled("div")`
  text-align: center;
  color: white;
`;

type Props = {
  join: (id: string) => void;
};

export const Title = ({ join }: Props) => {
  let ref: Ref<HTMLInputElement> = useRef();
  return (
    <TitleDiv>
      <h1>Chat app!</h1>
      <h2>Join a room.</h2>
      <input ref={ref} />
      <div>
        <button onClick={() => join(ref.current.value)}>Join</button>
      </div>
    </TitleDiv>
  );
};
