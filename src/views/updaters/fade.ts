import { style } from "../../lib/style";

type FadeProps = "in" | "out" | undefined;

export function fade($el: HTMLElement, props: FadeProps) {
  let amt = 20;

  if (!props) return;

  if (props === "in") {
    style($el, { opacity: 0, y: -amt });
    return style($el, { y: 0, opacity: 1 }, { duration: 300 });
  }

  if (props === "out") {
    style($el, { opacity: 1, y: 0 });
    return style($el, { opacity: 0, y: -amt }, { duration: 250 });
  }
}
