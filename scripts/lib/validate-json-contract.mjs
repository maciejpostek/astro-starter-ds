// The small JSON Schema vocabulary used by local task contracts. No coercion or defaults.
export const validateJsonContract = (value, schema, at = "$") => {
  const errors = [];
  const fail = (message) => errors.push(`${at}: ${message}`);
  if (schema.const !== undefined && value !== schema.const) fail("unexpected constant");
  if (schema.enum && !schema.enum.includes(value))
    fail(`expected one of ${schema.enum.join(", ")}`);
  const type = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  if (
    schema.type &&
    !(Array.isArray(schema.type) ? schema.type : [schema.type]).some(
      (t) => t === type || (t === "integer" && Number.isInteger(value)),
    )
  )
    return [...errors, `${at}: invalid type ${type}`];
  if (type === "string") {
    if (schema.minLength && value.length < schema.minLength) fail("string is too short");
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) fail("pattern mismatch");
  }
  if (type === "object") {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) fail(`missing ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key])
        errors.push(...validateJsonContract(item, schema.properties[key], `${at}.${key}`));
      else if (schema.additionalProperties === false) fail(`unknown property ${key}`);
    }
  }
  if (type === "array") {
    if (schema.minItems && value.length < schema.minItems) fail("too few items");
    if (schema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length)
      fail("duplicate items");
    if (schema.items)
      value.forEach((item, i) =>
        errors.push(...validateJsonContract(item, schema.items, `${at}[${i}]`)),
      );
  }
  for (const branch of schema.allOf ?? []) errors.push(...validateJsonContract(value, branch, at));
  if (schema.if) {
    const selected =
      validateJsonContract(value, schema.if, at).length === 0 ? schema.then : schema.else;
    if (selected) errors.push(...validateJsonContract(value, selected, at));
  }
  return errors;
};
