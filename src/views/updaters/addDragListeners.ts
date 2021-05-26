import { style } from "../../lib/style";

export const addDragListeners = (el: HTMLElement, onPlay: Function) => {
  let active: HTMLElement | false = false;
  let animating = false;

  let initialDragX: number;
  let initialDragY: number;
  let originalTranslateX: number;
  let originalTranslateY: number;

  function dragStart(e: MouseEvent | TouchEvent) {
    if (animating) return;

    //@ts-ignore
    let cardEl = e.target.closest(".card");

    if (cardEl) {
      active = cardEl;
    } else {
      return;
    }

    let { x, y } = getTranslateValues(cardEl);
    originalTranslateX = x;
    originalTranslateY = y;

    //@ts-ignore
    let locData = e.type === "touchstart" ? e.touches[0] : e;
    e.preventDefault();
    initialDragX = locData.pageX;
    initialDragY = locData.pageY;
  }

  function drag(e: MouseEvent | TouchEvent) {
    if (active) {
      e.preventDefault();
      //@ts-ignore
      let locData = e.type === "touchmove" ? e.touches[0] : e;
      style(active, {
        x: locData.pageX - initialDragX + originalTranslateX,
        y: locData.pageY - initialDragY + originalTranslateY,
      });
    }
  }

  function dragEnd(e: MouseEvent | TouchEvent) {
    if (!active) return;
    //@ts-ignore
    let locData = e.type === "touchend" ? e.changedTouches[0] : e;
    let yAmtMoved = initialDragY - locData.pageY;

    let vector = { x: originalTranslateX, y: originalTranslateY };
    let playAttempt = yAmtMoved > 100;
    let id = active.id;

    //let isValidPlay = playAttempt ? send(["playAttempt", id]) : false;
    if (playAttempt) {
      onPlay(id);
    } else {
      style(active, vector, {
        duration: 200,
        easing: "ease",
      });
    }

    active = false;
  }

  el.addEventListener("touchstart", dragStart, false);
  el.addEventListener("touchend", dragEnd, false);
  el.addEventListener("touchmove", drag, false);

  el.addEventListener("mousedown", dragStart, false);
  el.addEventListener("mouseup", dragEnd, false);
  el.addEventListener("mouseleave", dragEnd, false);
  el.addEventListener("mousemove", drag, false);
};

function getTranslateValues(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const matrix = style["transform"];

  if (matrix === "none" || typeof matrix === "undefined") {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  //@ts-ignore
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

  return {
    x: parseInt(matrixValues[4], 10),
    y: parseInt(matrixValues[5], 10),
  };
}
