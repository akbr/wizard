export const SEPERATOR = "|";

export const combineAll = (
  suits: string[],
  values: number[],
  seperator = SEPERATOR
) => {
  return suits.map((s) => values.map((v) => [v, s].join(SEPERATOR))).flat(1);
};
