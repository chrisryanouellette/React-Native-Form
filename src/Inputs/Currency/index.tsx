import React from "react";
import { formatAsCurrencyWithoutDollar } from "@src/helpers/formatNumberAsCurrency";

import { TextInput, TextInputProps } from "../Text";

function formatter(value: number | undefined): string {
  if (value === undefined) {
    return "0.00";
  }
  if (isNaN(value)) {
    return value.toString();
  }
  return formatAsCurrencyWithoutDollar(value);
}

export type CurrencyInputProps = TextInputProps;

export function CurrencyInput({
  inputProps,
  ...rest
}: CurrencyInputProps): JSX.Element {
  function handleUpdate(e: unknown) {
    inputProps?.onUpdate?.(Number(e));
  }

  return (
    <TextInput
      {...rest}
      inputProps={{
        ...inputProps,
        defaultValue: formatter(Number(inputProps?.defaultValue)),
        onUpdate: handleUpdate,
        prefix: "$",
      }}
    />
  );
}

CurrencyInput.displayName = "CurrencyInput";
