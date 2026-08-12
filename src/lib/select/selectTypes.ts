export type SelectPurpose = "basic" | "language" | "phone" | "country" | "brand" | "company";

export interface SelectOptionImageVisual {
  kind: "image";
  src: string;
  alt?: string;
}

export interface SelectOptionTextVisual {
  kind: "text";
  text: string;
}

export type SelectOptionVisual = SelectOptionImageVisual | SelectOptionTextVisual;

interface SelectOptionBase {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectOption = SelectOptionBase & (
  | {
      flag: string;
      visual?: never;
    }
  | {
      flag?: never;
      visual?: SelectOptionVisual;
    }
);
