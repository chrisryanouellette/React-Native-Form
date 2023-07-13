import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleSheet,
  TextInputFocusEventData,
  View,
  ViewProps,
} from "react-native";
import { TextThemeProps, useTheme } from "@src/theme-provider";
import fonts from "@src/fonts";
import Text from "@components/common/Text";

import { InputEvents, InputState } from "..";

export type InputProps = InputEvents<NativeTextInputProps> & {
  state?: InputState | "";
  prefix?: string | number;
  containerProps?: ViewProps;
  prefixContainerProps?: ViewProps;
  prefixTextProps?: TextThemeProps;
};

export function Input({
  state,
  prefix,
  containerProps,
  prefixContainerProps,
  defaultValue,
  onUpdate,
  onBlur,
  onFocus,
  ...rest
}: InputProps): JSX.Element {
  const theme = useTheme();
  const [focused, setFocused] = useState<boolean>(false);

  function handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
    setFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
    setFocused(false);
    onBlur?.(e);
  }

  function handleChange(e: string) {
    return onUpdate?.(e);
  }

  return (
    <View
      {...containerProps}
      style={[styles.containerStyles, containerProps?.style]}
    >
      {prefix ? (
        <View
          {...prefixContainerProps}
          style={[styles.prefix, prefixContainerProps?.style]}
        >
          <Text>{prefix}</Text>
        </View>
      ) : null}
      <NativeTextInput
        {...rest}
        style={[
          {
            borderColor: focused
              ? theme.colors["green-800"]
              : theme.colors["gray-600"],
          },
          prefix ? { paddingLeft: 20 } : null,
          state === "error"
            ? {
                borderColor: theme.colors["red-700"],
                backgroundColor: theme.colors["red-100"],
              }
            : { backgroundColor: "#FFF" },
          styles.inputStyles,
        ]}
        defaultValue={defaultValue ? defaultValue.toString() : undefined}
        onChangeText={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoCorrect={false}
        autoComplete="off"
      />
      {focused ? (
        <View
          style={[
            styles.inputFocusStyles,
            {
              backgroundColor:
                state === "error"
                  ? theme.colors["red-200"]
                  : theme.colors["green-100"],
            },
          ]}
        />
      ) : null}
    </View>
  );
}

Input.displayName = "Input";

const styles = StyleSheet.create({
  containerStyles: {
    position: "relative",
    height: 44,
  },
  inputStyles: {
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 44,
    fontSize: 18,
    fontFamily: fonts.regular,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  loadingInputFieldsStyle: {
    opacity: 0.3,
  },
  inputFocusStyles: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    zIndex: -1,
    borderRadius: 7,
    minHeight: "15%",
  },
  prefix: {
    position: "absolute",
    zIndex: 10,
    marginLeft: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    bottom: 0,
  },
});
