import React, { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from "react-native";
import Text from "@components/common/Text";
import { useStore } from "@src/helpers/store";
import { TextThemeProps, useTheme } from "@src/theme-provider";
import CheckLineIcon from "@components/Svg/CheckLineIcon";

import { useSelectContext } from "./context";

export type SelectItemProps = {
  value: string | number;
  label?: string | number;
  pressableProps?: PressableProps;
  textProps?: TextThemeProps;
  children?: ReactNode;
};

export function SelectItem({
  value,
  label,
  pressableProps,
  textProps,
  children,
}: SelectItemProps): JSX.Element {
  const theme = useTheme();
  const context = useSelectContext();
  const selected = useStore(context.store, state => {
    if (state.value instanceof Set) {
      return state.value.has(value);
    } else {
      return state.value === value;
    }
  });

  function handlePress(event: GestureResponderEvent): void {
    context.onUpdate(value);
    pressableProps?.onPress?.(event);
  }

  return (
    <Pressable
      accessibilityRole="togglebutton"
      accessibilityState={{ checked: selected }}
      {...pressableProps}
      style={args => [
        styles.button,
        typeof pressableProps?.style === "function"
          ? pressableProps.style(args)
          : pressableProps?.style,
        { borderBottomColor: theme.colors["gray-300"] },
      ]}
      onPress={handlePress}
    >
      <Text
        variant="semibold"
        color={selected ? "brand-primary-green" : "gray-800"}
        {...textProps}
        style={[styles.text, textProps?.style]}
      >
        {label ?? children}
      </Text>
      {selected ? (
        <View style={[styles.iconContainer]}>
          <CheckLineIcon
            size={20}
            color={theme.colors["brand-primary-green"]}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

SelectItem.displayName = "SelectItem";

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    paddingVertical: 20,
    marginHorizontal: 16,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 18,
  },
  iconContainer: {
    marginLeft: "auto",
  },
});
