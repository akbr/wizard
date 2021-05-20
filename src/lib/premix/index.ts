import { h, ComponentChildren, Fragment } from "preact";
import { Ref, useRef, useLayoutEffect } from "preact/hooks";

/**
 * Passes ref of first VNode/Component and supplied props to imperative update function (via useLayoutEffect).
 */
export const WithUpdate = <T>({
  props,
  update,
  children,
}: {
  props: T;
  update: ($el: HTMLElement, props: T) => void;
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
    update($el, props);
  }, [elRef, update, props]);

  return h(Fragment, null, children);
};
