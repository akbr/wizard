export type TableDimensions = {
  tW: number;
  tH: number;
};

export type Screen = {
  w: number;
  h: number;
};

export const CARD_W = 112;
export const CARD_H = 80;
export const X_PEEK = 35;
export const Y_PEEK = 65;

export function getRowInfo(width: number, numCards: number) {
  let maxInRow = Math.floor(width / X_PEEK);
  let numRows = Math.ceil(numCards / maxInRow);
  return { numRows, maxInRow };
}

function getHandHeight(width: number, numCards: number) {
  let { numRows } = getRowInfo(width, numCards);
  return numRows * Y_PEEK;
}

export const getTableDimensions = (
  { w, h }: Screen,
  numCards: number
): TableDimensions => ({
  tW: w,
  tH: h - getHandHeight(w, numCards),
});
