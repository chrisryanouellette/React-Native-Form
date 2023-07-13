import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import XIcon from "@components/Svg/XIcon";
import Text from "@components/common/Text";
import { TextThemeProps, useTheme } from "@src/theme-provider";

import { useSelectContext } from "./context";

type SelectModalProps = {
  title: string;
  titleProps?: TextThemeProps;
  subtitle?: string;
  subtitleProps?: TextThemeProps;
};

export function SelectModalHeader({
  title,
  titleProps,
  subtitle,
  subtitleProps,
}: SelectModalProps): JSX.Element {
  const theme = useTheme();
  const context = useSelectContext();

  function handleClose(): void {
    context.store.set({ isOpen: false });
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors["gray-300"],
          backgroundColor: "#fff",
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        style={[styles.button]}
        onPress={handleClose}
      >
        <XIcon />
      </Pressable>
      <View style={styles.titleContainer}>
        <Text
          variant="bold"
          {...titleProps}
          style={[styles.title, titleProps?.style]}
        >
          {title}
        </Text>
        {subtitle ? <Text {...subtitleProps}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  button: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 8,
    flexGrow: 0,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    marginTop: 8,
    marginRight: 48,
  },
  title: {
    fontSize: 20,
  },
});
