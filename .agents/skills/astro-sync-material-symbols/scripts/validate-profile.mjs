#!/usr/bin/env node

const args = Object.fromEntries(
  process.argv.slice(2).map((entry) => {
    const [rawKey, ...rawValue] = entry.replace(/^--/, "").split("=");
    return [rawKey, rawValue.join("=")];
  })
);

const families = {
  outlined: {
    family: "Material Symbols Outlined",
    slug: "materialsymbolsoutlined"
  },
  rounded: {
    family: "Material Symbols Rounded",
    slug: "materialsymbolsrounded"
  },
  sharp: {
    family: "Material Symbols Sharp",
    slug: "materialsymbolssharp"
  }
};

const allowedWeights = new Set([100, 200, 300, 400, 500, 600, 700]);
const allowedGrades = new Set([-25, 0, 200]);
const allowedFills = new Set([0, 1]);
const allowedOpticalSizes = new Set([20, 24, 40, 48]);

const profile = {
  style: args.style ?? "sharp",
  weight: Number(args.weight ?? 400),
  grade: Number(args.grade ?? 0),
  fill: Number(args.fill ?? 0),
  opticalSize: Number(args["optical-size"] ?? 20)
};
const name = args.name ?? "arrow_forward";

const errors = [];
if (!families[profile.style]) errors.push(`Unsupported style: ${profile.style}`);
if (!allowedWeights.has(profile.weight)) errors.push(`Unsupported static SVG weight: ${profile.weight}`);
if (!allowedGrades.has(profile.grade)) errors.push(`Unsupported static SVG grade: ${profile.grade}`);
if (!allowedFills.has(profile.fill)) errors.push(`Unsupported fill: ${profile.fill}`);
if (!allowedOpticalSizes.has(profile.opticalSize)) errors.push(`Unsupported static SVG optical size: ${profile.opticalSize}`);
if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name)) errors.push(`Invalid Google snake_case glyph name: ${name}`);

if (errors.length) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const variantParts = [];
if (profile.weight !== 400) variantParts.push(`wght${profile.weight}`);
if (profile.grade !== 0) {
  variantParts.push(`grad${profile.grade < 0 ? `N${Math.abs(profile.grade)}` : profile.grade}`);
}
if (profile.fill !== 0) variantParts.push(`fill${profile.fill}`);
const variant = variantParts.join("") || "default";
const provider = families[profile.style];
const sourceSvg = `https://fonts.gstatic.com/s/i/short-term/release/${provider.slug}/${name}/${variant}/${profile.opticalSize}px.svg`;

console.log(JSON.stringify({
  providerId: "google-material-symbols",
  family: provider.family,
  profile,
  variant,
  figmaName: `Icon/Material/${name}`,
  sourceSvg
}, null, 2));
