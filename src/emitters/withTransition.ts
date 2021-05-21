import { createMeter } from "../lib/meter";
import { pairwise } from "../lib/fn";

type Transition<T> = [T, "in" | "out" | undefined];

export function withTransition<T>(listener: (arg: Transition<T>) => void) {
  const { push, release, waitFor } = createMeter<Transition<T>>(listener);

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
