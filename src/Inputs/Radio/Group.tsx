import React, { ReactNode, useCallback, useMemo } from "react";
import { View, ViewProps } from "react-native";

import { ErrorProps, Errors, InputEvents, Label, LabelProps } from "..";
import { commonInputStyles } from "../styles";

import { RadioContext } from "./context";
import { UseRadio, useRadio } from "./useRadio";

export type RadioGroupProps = {
  label: string;
  helperText?: string;
  hideLabel?: boolean;
  labelProps?: LabelProps;
  radio?: UseRadio;
  children?: ReactNode;
  containerProps?: ViewProps;
  inputProps?: InputEvents<unknown>;
  errorProps?: ErrorProps;
};

export function RadioGroup({
  label,
  helperText,
  hideLabel,
  labelProps,
  radio: controlledRadio,
  containerProps,
  inputProps,
  errorProps,
  children,
}: RadioGroupProps): JSX.Element {
  const internalRadio = useRadio();
  const radio = controlledRadio ?? internalRadio;

  function handleUpdate(event: unknown): void {
    radio.store.set({ selected: event });
    inputProps?.onUpdate?.(event);
  }

  const context = { onUpdate: handleUpdate, ...radio };

  return (
    <RadioContext.Provider value={context}>
      <View
        accessibilityLabel={label}
        accessibilityRole="radiogroup"
        accessibilityHint={errorProps?.errors?.join(", ") ?? undefined}
        {...containerProps}
        style={[commonInputStyles.containerStyles, containerProps?.style]}
      >
        {!hideLabel ? (
          <Label helperText={helperText} {...labelProps}>
            {label}
          </Label>
        ) : null}
        {children}
        <Errors {...errorProps} />
      </View>
    </RadioContext.Provider>
  );
}

RadioGroup.displayName = "RadioGroup";
