import iconLibrary from "../../data/design-system/iconLibrary.json";

export const materialSymbols = iconLibrary.icons;

export type MaterialSymbolName = keyof typeof materialSymbols;

export const materialSymbolNames = Object.keys(
  materialSymbols
) as MaterialSymbolName[];

export const getMaterialSymbol = (name: MaterialSymbolName) =>
  materialSymbols[name];
