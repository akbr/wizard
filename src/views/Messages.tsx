import { h } from "preact";
import { useRef, Ref } from "preact/hooks";

type Props = {
  messages: [number, string][];
  post: (msg: string) => void;
  exit: () => void;
};

export const Messages = ({ messages, post, exit }: Props) => {
  let ref: Ref<HTMLInputElement> = useRef();
  return (
    <div>
      <h3>You're in a room!</h3>
      {messages.map(([player, msg]) => (
        <div>
          Player {player}: {msg}
        </div>
      ))}
      <input ref={ref} />
      <button onClick={() => post(ref.current.value)}>Send</button>
      <button onClick={exit}>Exit</button>
    </div>
  );
};
