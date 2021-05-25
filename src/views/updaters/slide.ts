import { style } from "../../lib/style";

type FadeProps = "in" | "out" | undefined;

export function slide($el: HTMLElement, props: FadeProps) {
  if (!props) return;
  if (props === "in") {
    style($el, { y: -100 });
    style($el, { y: 0 }, { duration: 500 });
  }
  if (props === "out") {
    style($el, { y: -100 }, { duration: 500 });
  }
}
