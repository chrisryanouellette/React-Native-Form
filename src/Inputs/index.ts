import { ErrorProps, LabelProps } from "./Utilities";

export * from "./Text";
export * from "./Utilities";

export type InputState = "disabled" | "error";
export type InputEvents<T> = T & {
  onUpdate?: (value: unknown) => void;
};
export type ComposedInputProps<T, U = unknown> = {
  state?: InputState | "";
  labelProps?: LabelProps;
  inputProps?: T & { defaultValue?: U };
  errorProps?: ErrorProps;
};
