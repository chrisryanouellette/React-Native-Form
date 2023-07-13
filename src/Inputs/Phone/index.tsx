import React, { useEffect, useRef, useState } from "react";
import formatPhoneNumberWhileTyping from "@src/helpers/formatPhoneNumberWhileTyping";

import { TextInput, TextInputProps } from "../Text";

function formatter(value: string): string {
  return formatPhoneNumberWhileTyping(value) ?? value;
}

export type PhoneInputProps = TextInputProps & {
  disableAutoComplete?: boolean;
};

export function PhoneInput({
  disableAutoComplete,
  inputProps,
  ...rest
}: PhoneInputProps): JSX.Element {
  const [value, setValue] = useState<string>(inputProps?.defaultValue ?? "");
  const defaultValue = useRef<boolean | undefined>(!!inputProps?.defaultValue);

  function handleUpdate(e: unknown) {
    if (typeof e === "string") {
      setValue(e);
    }
    inputProps?.onUpdate?.(e);
  }

  /*
    Update state when the default value was set asynchronously.
    this happens when the default value is set in a useEffect.
   */
  useEffect(
    function handleSyncDefaultValue() {
      if (!defaultValue.current && inputProps?.defaultValue) {
        defaultValue.current = true;
        setValue(formatter(inputProps.defaultValue));
      }
    },
    [inputProps?.defaultValue],
  );

  return (
    <TextInput
      {...rest}
      inputProps={{
        autoComplete: !disableAutoComplete ? "tel" : undefined,
        keyboardType: "number-pad",
        ...inputProps,
        value: formatter(value),
        defaultValue: formatter(inputProps?.defaultValue ?? ""),
        onUpdate: handleUpdate,
      }}
    />
  );
}

PhoneInput.displayName = "PhoneInput";
