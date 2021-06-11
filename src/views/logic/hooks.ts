import { useState, useEffect } from "preact/hooks";
import { getAppDimensions, getTableDimensions } from "./dimensions";

export function useAppDimensions() {
  let [dimensions, setDimensions] = useState(getAppDimensions());

  function update() {
    setDimensions(getAppDimensions());
  }

  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dimensions;
}

export function useTableDimensions(numCards: number) {
  let [dimensions, setDimensions] = useState(getTableDimensions(numCards));

  function update() {
    setDimensions(getTableDimensions(numCards));
  }

  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [numCards]);

  return dimensions;
}
