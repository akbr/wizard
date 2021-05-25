import { createMeter } from "../lib/meter";
import { pairwise } from "../lib/fn";

export type Transition = "in" | "out" | undefined;
type TransitionTuple<T> = [T, Transition];

export function createTransition<T>(
  listener: (arg: TransitionTuple<T>) => void
) {
  const { push, release, waitFor } = createMeter<TransitionTuple<T>>(listener);

  const injectTransition = pairwise<T, void>((curr, prev) => {
    if (prev !== undefined) push([prev, "out"]);
    push([curr, "in"]);
    push([curr, undefined]);
  });

  return {
    push: injectTransition,
    release,
    waitFor,
  };
}
