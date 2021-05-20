import { getTuple } from "../core/helpers";

export type Spec = {
  suitGlyph: string;
  valueGlyph: string | false;
  color: string;
};

type getSpec = (value: number, suit: string) => Spec;

const standardVisuals = {
  suitColors: {
    c: "black",
    h: "#DC143C",
    s: "black",
    d: "#DC143C",
  },
  valueGlyphs: {
    11: "J",
    12: "Q",
    13: "K",
    14: "A",
  },
};

const getStandardSpec: getSpec = (value, suit) => ({
  suitGlyph: suit,
  //@ts-ignore
  valueGlyph: standardVisuals.valueGlyphs[value] || value,
  //@ts-ignore
  color: standardVisuals.suitColors[suit],
});

const getWizardSpec: getSpec = (_, suit) => ({
  suitGlyph: suit === "w" ? "W" : "E",
  valueGlyph: false,
  color: "blue",
});

export default (id: string) => {
  let [value, suit] = getTuple(id);
  return ["c", "h", "s", "d"].indexOf(suit) > -1
    ? getStandardSpec(value, suit)
    : getWizardSpec(value, suit);
};
