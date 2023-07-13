import React from "react";
import { View, ViewProps } from "react-native";

import { Label, Errors, Input, InputProps } from "../Utilities";
import { commonInputStyles } from "../styles";
import { ComposedInputProps } from "..";

export type TextInputProps = ComposedInputProps<InputProps> & {
  label: string;
  helperText?: string;
  hideLabel?: boolean;
  containerProps?: ViewProps;
  inputContainerProps?: ViewProps;
};

export function TextInput({
  label,
  hideLabel,
  helperText,
  state,
  containerProps,
  errorProps,
  inputContainerProps,
  labelProps,
  inputProps,
}: TextInputProps) {
  return (
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
        accessibilityHint={errorProps?.errors?.join(", ") ?? ""}
        {...inputProps}
        state={state}
        containerProps={inputContainerProps}
      />
      <Errors {...errorProps} />
    </View>
  );
}

TextInput.displayName = "TextInput";
