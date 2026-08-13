import type { SVGProps } from "react";
import {
  getMaterialSymbol,
  type MaterialSymbolName
} from "../../../lib/icons/materialSymbols";

export type MaterialSymbolProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "name"
> & {
  name: MaterialSymbolName;
  size?: number | string;
  label?: string;
};

export default function MaterialSymbol({
  name,
  size = "1em",
  label,
  ...attributes
}: MaterialSymbolProps) {
  const icon = getMaterialSymbol(name);

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      data-material-symbol={name}
      fill="currentColor"
      focusable="false"
      height={size}
      preserveAspectRatio="xMidYMid meet"
      role={label ? "img" : undefined}
      viewBox={icon.viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      {icon.paths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
