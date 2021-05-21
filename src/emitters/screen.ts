export type Screen = {
  w: number;
  h: number;
};

function parseCSSVar(varName: string) {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(varName),
    10
  );
}

const getDimensions = (maxWidth: number) => ({
  w: window.innerWidth < maxWidth ? window.innerWidth : maxWidth,
  h: window.innerHeight,
});

export const createScreen = (emit: (x: Screen) => void) => {
  let maxWidth = parseCSSVar("--max-width");
  emit(getDimensions(maxWidth));
  window.onresize = () => emit(getDimensions(maxWidth));
  return () => (window.onresize = () => undefined);
};
