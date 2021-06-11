import { getHandHeight } from "./hand";

export const MAX_WIDTH = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--max-width"),
  10
);
export const CARD_W = 112;
export const CARD_H = 80;

export const getAppDimensions = () => ({
  w: window.innerWidth < MAX_WIDTH ? window.innerWidth : MAX_WIDTH,
  h: window.innerHeight,
});

export const getTableDimensions = (numCards: number) => {
  let { w, h } = getAppDimensions();
  return {
    w,
    h: h - getHandHeight(w, numCards),
  };
};
