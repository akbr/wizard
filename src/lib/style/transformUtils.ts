type BasicTransforms = {
  x?: number | string;
  y?: number | string;
  rotate?: number | string;
  scale?: number | string;
};

function convertUnit(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

export function getBasicTransformString({
  x,
  y,
  rotate,
  scale,
}: BasicTransforms) {
  let strs: string[] = [];
  if (x !== undefined) {
    strs.push(`translateX(${convertUnit(x)})`);
  }
  if (y !== undefined) {
    strs.push(`translateY(${convertUnit(y)})`);
  }
  if (rotate !== undefined) {
    strs.push(`rotate(${rotate}deg)`);
  }
  if (scale !== undefined) {
    strs.push(`scale(${scale})`);
  }
  return strs.join(" ");
}

export function patchTransform(styles: { [key: string]: string | number }) {
  let { x, y, rotate, scale, ...modStyles } = styles;
  let transform = getBasicTransformString({ x, y, rotate, scale });
  if (transform === "") return styles;
  modStyles.transform = transform;
  return modStyles;
}
