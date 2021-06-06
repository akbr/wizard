import {
  h,
  render,
  FunctionComponent,
  ComponentChildren,
  Fragment,
} from "preact";
import { Ref, useRef, useLayoutEffect } from "preact/hooks";
import { Task } from "../task";

let tasks: Task<unknown>[] = [];

export function createViewFn<T>(View: FunctionComponent<T>, $el: HTMLElement) {
  return function update(x?: T) {
    tasks = [];
    render(h(View, x || null), $el);
    return tasks;
  };
}

/**
 * Passes ref of first VNode/Component and supplied props to imperative update function (via useLayoutEffect).
 */
export const WithUpdate = <T>({
  props,
  update,
  children,
}: {
  props: T;
  update: ($el: HTMLElement, props: T) => void | Task<unknown>;
  children?: ComponentChildren;
}) => {
  let elRef: Ref<HTMLElement> = useRef();
  let firstChild = Array.isArray(children) ? children[0] : children;

  if (!firstChild) return null;

  //@ts-ignore
  if (!firstChild.ref) {
    //@ts-ignore
    firstChild.ref = elRef;
  }

  useLayoutEffect(() => {
    // This is a hack around having to use forwardRef
    //@ts-ignore
    let $el = elRef.current.base ? elRef.current.base : elRef.current;
    let task = update($el, props);
    if (task) tasks.push(task);
  }, [elRef, update, props]);

  return h(Fragment, null, children);
};
