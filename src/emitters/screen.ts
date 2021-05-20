export type State = {
  w: number;
  h: number;
};

function parseCSSVar(varName: string) {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(varName),
    10
  );
}

const MAX_WIDTH = parseCSSVar("--max-width");

const getDimensions = () => ({
  w: window.innerWidth < MAX_WIDTH ? window.innerWidth : MAX_WIDTH,
  h: window.innerHeight,
});

export default (emit: (x: State) => void) => {
  emit(getDimensions());
  window.onresize = () => emit(getDimensions());
  return () => (window.onresize = () => undefined);
};
