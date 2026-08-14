export type ValidationState = "none" | "success" | "warning" | "error";
export type LegacyValidationState = "default" | "valid" | "invalid";
export type InputValidation = ValidationState | LegacyValidationState;

export function normalizeValidationState(
  value: InputValidation = "none"
): ValidationState {
  if (value === "default") return "none";
  if (value === "valid") return "success";
  if (value === "invalid") return "error";
  return value;
}
