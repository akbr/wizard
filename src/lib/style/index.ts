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

export function style(el: HTMLElement, styles: Dict, options: Dict | void) {
  return createTask<void>((done) => {
    styles = patchTransform(styles);

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
