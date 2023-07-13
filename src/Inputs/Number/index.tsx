import React from "react";

import { TextInput, TextInputProps } from "../Text";

export type NumberProps = TextInputProps;

export function NumberInput({ inputProps, ...rest }: NumberProps): JSX.Element {
  function handleUpdate(update: unknown): void {
    return inputProps?.onUpdate?.(Number(update));
  }

  return (
    <TextInput
      {...rest}
      inputProps={{
        keyboardType: "number-pad",
        ...inputProps,
        onUpdate: handleUpdate,
      }}
    />
  );
}

NumberInput.displayName = "NumberInput";
