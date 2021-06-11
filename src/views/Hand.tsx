import { h } from "preact";
import { WithUpdate } from "../lib/premix";
import { useAppDimensions } from "./logic/hooks";
import { handUpdater } from "./logic/hand";

export function Hand({ hand }: { hand: string[] }) {
  let screen = useAppDimensions();
  return (
    <WithUpdate update={handUpdater} props={{ hand, screen }}>
      <div />
    </WithUpdate>
  );
}
