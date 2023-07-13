import React, { ReactNode, useEffect, useRef } from "react";
import { View, ViewProps } from "react-native";
import { useCreateStore } from "@src/helpers/store";

import { Label, Errors, Input, InputProps } from "../Utilities";
import { commonInputStyles } from "../styles";
import { ComposedInputProps } from "..";

import { ZipInputContext, ZipInputStore } from "./context";

export type ZipCodeInputProps = ComposedInputProps<InputProps> & {
  label: string;
  helperText?: string;
  hideLabel?: boolean;
  containerProps?: ViewProps;
  inputContainerProps?: ViewProps;
  children?: ReactNode;
};

export function ZipCodeInput({
  label,
  hideLabel,
  helperText,
  state,
  containerProps,
  errorProps,
  inputProps,
  inputContainerProps,
  labelProps,
  children,
}: ZipCodeInputProps) {
  const store = useCreateStore<ZipInputStore>({ value: null });
  const defaultValueRef = useRef<boolean>(false);

  function handleUpdate(event: unknown): void {
    if (typeof event !== "string") {
      throw new Error(
        "Zip code base input fired a change event with a new value that is not a string.",
      );
    }
    store.set({ value: event });
    inputProps?.onUpdate?.(event);
  }

  useEffect(
    function handleSyncDefaultValue() {
      if (!defaultValueRef.current && inputProps?.defaultValue) {
        defaultValueRef.current = true;
        store.set({ value: inputProps.defaultValue });
      }
    },
    [inputProps?.defaultValue, store],
  );

  return (
    <ZipInputContext.Provider value={{ store, onUpdate: handleUpdate }}>
      <View
        {...containerProps}
        style={[commonInputStyles.containerStyles, containerProps?.style]}
      >
        {!hideLabel ? (
          <Label helperText={helperText} {...labelProps}>
            {label}
          </Label>
        ) : null}
        <Input
          accessibilityLabel={label}
          accessibilityHint={errorProps?.errors?.join(", ") ?? undefined}
          keyboardType="number-pad"
          {...inputProps}
          defaultValue={inputProps?.defaultValue ?? undefined}
          state={state}
          containerProps={inputContainerProps}
          onUpdate={handleUpdate}
        />
        <Errors {...errorProps} />
        {children}
      </View>
    </ZipInputContext.Provider>
  );
}

ZipCodeInput.displayName = "ZipCodeInput";
