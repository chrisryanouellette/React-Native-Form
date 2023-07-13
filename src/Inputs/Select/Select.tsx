import React, { ReactNode, useEffect, useRef } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { TextThemeProps, useTheme } from "@src/theme-provider";
import Text from "@components/common/Text";
import RightChevron from "@components/Svg/LeftChevron";
import { useStore } from "@src/helpers/store";

import { InputEvents, InputState } from "..";

import { SelectStore, useSelectContext } from "./context";
import { SelectModal, SelectModalProps } from "./Modal";

function selectValue(state: SelectStore): string | number {
  if (state.value instanceof Set) {
    return Array.from(state.value).join(", ");
  }
  return state.value ?? "";
}

export type SelectProps = InputEvents<PressableProps> & {
  defaultValue?: unknown;
  state?: InputState | "";
  prefix?: string | number;
  containerProps?: ViewProps;
  prefixContainerProps?: ViewProps;
  prefixTextProps?: TextThemeProps;
  modalProps?: Omit<SelectModalProps, "children">;
  stickyHeader?: boolean;
  children: ReactNode;
};

export function Select({
  state,
  prefix,
  containerProps,
  prefixContainerProps,
  prefixTextProps,
  modalProps,
  stickyHeader,
  defaultValue,
  style,
  children,
  ...rest
}: SelectProps): JSX.Element {
  const theme = useTheme();
  const context = useSelectContext();
  const value = useStore(context.store, selectValue);
  const defaultValueRef = useRef<boolean>(false);
  const multi = context.store.get().value instanceof Set;

  function handleOpen(): void {
    context.store.set({ isOpen: true });
  }
  /*
    Update state when the default value was set asynchronously.
    this happens when the default value is set in a useEffect.
   */
  useEffect(
    function handleSyncDefaultValue() {
      if (!defaultValueRef.current && defaultValue) {
        defaultValueRef.current = true;
        /** @TODO use conditional props to determine what type the default value is */
        context.store.set({
          value: multi
            ? new Set([defaultValue as string])
            : (defaultValue as string),
        });
      }
    },
    [context, defaultValue, multi],
  );

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
          <Text {...prefixTextProps}>{prefix}</Text>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="combobox"
        {...rest}
        style={args => [
          {
            borderColor: args.pressed
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
          typeof style === "function" ? style(args) : style,
        ]}
        onPress={handleOpen}
      >
        <Text style={styles.selectText} color="gray-900">
          {value}
        </Text>
        <View style={styles.chevronContainer}>
          <RightChevron size={12} />
        </View>
      </Pressable>
      <SelectModal {...modalProps} stickyHeader={stickyHeader}>
        {children}
      </SelectModal>
    </View>
  );
}

Select.displayName = "Select";

const styles = StyleSheet.create({
  containerStyles: {
    position: "relative",
    height: 44,
  },
  inputStyles: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  loadingInputFieldsStyle: {
    opacity: 0.3,
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
  selectText: {
    flex: 1,
    fontSize: 18,
  },
  chevronContainer: {
    marginRight: 8,
    transform: [
      {
        rotate: "-90deg",
      },
    ],
  },
});
