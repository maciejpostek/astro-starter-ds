const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const hasComponentIdentity = (source, name) => {
  const escaped = escapeRegExp(name);
  return (
    new RegExp(`data-component-name\\s*=\\s*["']${escaped}["']`, "u").test(source) ||
    new RegExp(`componentName\\s*=\\s*["']${escaped}["']`, "u").test(source) ||
    (source.includes("data-component-name={componentName}") &&
      new RegExp(`componentName\\s*=\\s*["']${escaped}["']`, "u").test(source))
  );
};
