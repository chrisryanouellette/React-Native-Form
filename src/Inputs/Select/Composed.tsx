import React, { ReactNode, useCallback, useMemo } from "react";
import { View, ViewProps } from "react-native";
import { useCreateStore } from "@src/helpers/store";

import { Label, Errors } from "../Utilities";
import { commonInputStyles } from "../styles";
import { ComposedInputProps } from "..";

import { Select, SelectProps } from "./Select";
import { SelectContext, SelectContextType, SelectStore } from "./context";

export type SelectInputProps = ComposedInputProps<
  Omit<SelectProps, "children">
> & {
  label: string;
  helperText?: string;
  hideLabel?: boolean;
  multi?: boolean;
  containerProps?: ViewProps;
  inputContainerProps?: ViewProps;
  stickyHeader?: boolean;
  children: ReactNode;
};

export function SelectInput({
  label,
  hideLabel,
  helperText,
  multi,
  state,
  containerProps,
  errorProps,
  inputContainerProps,
  labelProps,
  inputProps,
  stickyHeader,
  children,
}: SelectInputProps) {
  const store = useCreateStore<SelectStore>({
    isOpen: false,
    value: multi ? new Set() : null,
  });

  const handleUpdate = useCallback(
    (value: string | number) => {
      let { value: storeValue } = store.get();
      if (storeValue instanceof Set) {
        if (storeValue.has(value)) {
          storeValue.delete(value);
        } else {
          storeValue.add(value);
        }
      } else {
        storeValue = value;
      }
      inputProps?.onUpdate?.(storeValue);
      store.set({ value: storeValue, isOpen: !multi ? false : true });
    },
    [inputProps, store, multi],
  );

  const context = useMemo<SelectContextType>(
    () => ({ store, onUpdate: handleUpdate }),
    [handleUpdate, store],
  );

  return (
    <SelectContext.Provider value={context}>
      <View
        {...containerProps}
        style={[commonInputStyles.containerStyles, containerProps?.style]}
      >
        {!hideLabel ? (
          <Label helperText={helperText} {...labelProps}>
            {label}
          </Label>
        ) : null}
        <Select
          accessibilityLabel={label}
          accessibilityHint={errorProps?.errors?.join(", ") ?? undefined}
          {...inputProps}
          state={state}
          containerProps={inputContainerProps}
          stickyHeader={stickyHeader}
        >
          {children}
        </Select>
        <Errors {...errorProps} />
      </View>
    </SelectContext.Provider>
  );
}

SelectInput.displayName = "SelectInput";
