import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import CheckBox, { CheckBoxProps } from "@react-native-community/checkbox";
import { useTheme } from "@src/theme-provider";
import { useUuid } from "@src/hooks/useUuid";

import { ComposedInputProps, Errors, InputEvents, Label } from "..";
import { commonInputStyles } from "../styles";

export type CheckboxInputProps = ComposedInputProps<
  InputEvents<CheckBoxProps>
> & {
  label: string;
  id?: string;
  helperText?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  containerProps?: ViewProps;
  inputContainerProps?: ViewProps;
};

export function CheckboxInput({
  label,
  id: controlledId,
  hideLabel,
  helperText,
  disabled,
  state,
  containerProps,
  errorProps,
  inputContainerProps,
  labelProps,
  inputProps,
}: CheckboxInputProps) {
  const theme = useTheme();
  const internalId = useUuid();
  const id = controlledId ?? internalId;
  /*
    The checkbox component does not support default value so
    we need to track it via state.
  */
  const [checked, setChecked] = useState<boolean>(
    (inputProps?.defaultValue as boolean) ?? false,
  );
  const defaultValue = useRef<boolean | undefined>(
    inputProps?.defaultValue as boolean,
  );

  function handleValueChange(value: boolean): void {
    if (!disabled) {
      setChecked(!checked);
      inputProps?.onUpdate?.(value);
    }
  }

  function handlePressCheckbox(): void {
    handleValueChange(!checked);
  }

  /*
    Update state when the default value was set asynchronously.
    this happens when the default value is set in a useEffect.
   */
  useEffect(
    function handleSyncDefaultValue() {
      if (defaultValue.current === undefined && inputProps?.defaultValue) {
        defaultValue.current = true;
        setChecked(true);
      }
    },
    [inputProps?.defaultValue],
  );

  return (
    <View
      {...containerProps}
      style={[commonInputStyles.containerStyles, containerProps?.style]}
    >
      <View
        {...inputContainerProps}
        style={[
          styles.inputContainer,
          { opacity: disabled ? 0.5 : 1 },
          inputContainerProps?.style,
        ]}
      >
        <CheckBox
          disabled={disabled}
          aria-disabled={disabled}
          accessibilityHint={errorProps?.errors?.join(", ") ?? undefined}
          boxType="square"
          onAnimationType="flat"
          animationDuration={0}
          lineWidth={1}
          onCheckColor="white"
          accessibilityLabel={label}
          onTintColor={
            state === "error"
              ? theme.colors["red-800"]
              : theme.colors["green-700"]
          }
          onFillColor={theme.colors["green-700"]}
          {...inputProps}
          accessibilityLabelledBy={id}
          onValueChange={handleValueChange}
          value={checked}
          style={[styles.checkbox, inputProps?.style]}
        />
        {!hideLabel ? (
          <Label
            helperText={helperText}
            {...labelProps}
            nativeID={id}
            containerProps={{
              ...labelProps?.containerProps,
              style: [styles.label, labelProps?.containerProps?.style],
            }}
            onPress={Platform.OS === "ios" ? handlePressCheckbox : undefined}
          >
            {label}
          </Label>
        ) : null}
      </View>
      <Errors
        {...errorProps}
        containerProps={{
          ...errorProps?.containerProps,
          style: [styles.error, errorProps?.containerProps?.style],
        }}
      />
    </View>
  );
}

CheckboxInput.displayName = "CheckboxInput";

/** these styles should not be edited, they will effect every checkbox in the app */
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  label: {
    marginBottom: 0,
  },
  error: {
    marginLeft: 36,
  },
});
