import { Hints } from "../actions";

export interface HintTable {
  headers: string[];
  rows: { colspan: number; hint: string }[][];
}

export const getHintTable = (hints: Hints, token: string) => {
  const entry: string[] = hints[token];
  if (!entry) {
    return undefined;
  }
  return {
    headers: [],
    rows: entry.map(e => [{ colspan: 1, hint: e }]),
  };
};

export const getTokens = (hints: Hints) => Object.keys(hints);
