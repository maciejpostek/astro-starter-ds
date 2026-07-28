import { Component, House, Ruler, SwatchBook } from "@lucide/astro";
import type { AstroComponent as IconComponent } from "@lucide/astro";

export type PublicNavigationItem = {
  href: string;
  label: string;
  icon: IconComponent;
};

export const publicNavigation: PublicNavigationItem[] = [
  { href: "/", label: "Start", icon: House },
  { href: "/design-system/color", label: "Foundations", icon: SwatchBook },
  { href: "/design-system/layout", label: "Layout", icon: Ruler },
  { href: "/design-system/components", label: "Components", icon: Component }
];

const normalizePath = (path: string) => {
  const trimmed = path.trim();
  if (trimmed === "/") return "/";
  return trimmed.replace(/\/+$/, "");
};

export const isCurrentPath = (activePath: string, href: string) => {
  const active = normalizePath(activePath);
  const target = normalizePath(href);
  if (!active || !target) return false;
  if (target === "/") return active === "/";
  return active === target || active.startsWith(`${target}/`);
};
