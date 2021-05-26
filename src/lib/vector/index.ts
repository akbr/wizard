export type Vector = {
  x: number;
  y: number;
};

export const add = (...vecs: Vector[]): Vector =>
  vecs.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), {
    x: 0,
    y: 0,
  });

export const multiply = (a: Vector, b: Vector): Vector => ({
  x: a.x * b.x,
  y: a.y * b.y,
});

export const invert = (a: Vector): Vector => ({
  x: a.x * -1,
  y: a.y * -1,
});
