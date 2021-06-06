import { useState, useEffect } from "preact/hooks";

function parseCSSVar(varName: string) {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(varName),
    10
  );
}

const maxWidth = parseCSSVar("--max-width");

const getDimensions = (maxWidth: number) => ({
  w: window.innerWidth < maxWidth ? window.innerWidth : maxWidth,
  h: window.innerHeight,
});

export function useScreen() {
  let [screen, setScreen] = useState(getDimensions(maxWidth));

  function update() {
    setScreen(getDimensions(maxWidth));
  }

  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return screen;
}
