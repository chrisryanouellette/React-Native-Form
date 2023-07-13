import React, { ReactNode } from "react";
import Text from "@components/common/Text";
import { StyleSheet, View, ViewProps } from "react-native";
import { TextThemeProps } from "@src/theme-provider";

export type LabelProps = TextThemeProps & {
  containerProps?: ViewProps;
  requiredProps?: TextThemeProps;
  required?: boolean;
  helperText?: ReactNode;
  helperTextProps?: TextThemeProps;
  labelExtra?: ReactNode;
};

export function Label({
  style,
  required,
  children,
  containerProps,
  requiredProps,
  helperText,
  helperTextProps,
  labelExtra,
  ...rest
}: LabelProps): JSX.Element {
  return (
    <>
      {children ? (
        <View
          {...containerProps}
          style={[styles.containerStyles, containerProps?.style]}
        >
          <Text {...rest} style={[styles.inputLabel, style]}>
            {children}
          </Text>
          {required ? (
            <Text
              color="gray-700"
              {...requiredProps}
              style={[styles.requiredText, requiredProps?.style]}
            >
              Required
            </Text>
          ) : null}
          {labelExtra}
          {helperText ? (
            <Text
              color="gray-700"
              {...helperTextProps}
              style={[styles.helperText, helperTextProps?.style]}
            >
              {helperText}
            </Text>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

Label.displayName = "Label";

const styles = StyleSheet.create({
  containerStyles: { flexDirection: "row", marginBottom: 8, flexWrap: "wrap" },
  inputLabel: {
    fontWeight: "600",
  },
  requiredText: {
    paddingLeft: 8,
    lineHeight: 16,
  },
  helperText: {
    marginTop: 2,
    fontSize: 14,
    flexBasis: "100%",
  },
});
