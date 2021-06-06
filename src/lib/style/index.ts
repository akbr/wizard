import createTask from "../task";
import { patchTransform } from "./transformUtils";

type Dict = {
  [key: string]: string | number;
};

function applyStyles(styles: Dict, el: HTMLElement) {
  Object.entries(styles).forEach(([key, value]) => {
    //@ts-ignore
    el.style[key] = value;
  });
}

function areIdentical(targetStyles: Dict, $el: HTMLElement) {
  let identical = true;
  Object.entries(targetStyles).forEach(([key, value]) => {
    if (!identical) return;
    //@ts-ignore
    if ($el.style[key] !== value) identical = false;
  });
  return identical;
}

export function style(el: HTMLElement, styles: Dict, options: Dict | void) {
  return createTask<void>((done) => {
    styles = patchTransform(styles);

    if (areIdentical(styles, el)) {
      done();
      return () => undefined;
    }

    const finish = () => {
      applyStyles(styles, el);
      done();
    };

    if (options === undefined) {
      finish();
      return () => undefined;
    }

    let animation = el.animate(styles, options);
    animation.onfinish = finish;

    return () => {
      animation.finish();
      finish();
    };
  });
}
