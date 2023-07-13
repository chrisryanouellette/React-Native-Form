import React, { Fragment } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Text from "@components/common/Text";
import { TextThemeProps, useTheme } from "@src/theme-provider";
import WarningExclamation from "@components/Svg/WarningExclamation";
import { SvgProps } from "@components/Svg/models";

export type ErrorProps = Omit<TextThemeProps, "children"> & {
  hidden?: boolean;
  containerProps?: ViewProps;
  wrapperProps?: ViewProps;
  errors?: string[];
  showIcon?: boolean;
  iconProps?: SvgProps;
  errorExtra?: React.ReactNode;
};

export function Errors({
  hidden,
  errors,
  containerProps,
  wrapperProps,
  style,
  showIcon,
  iconProps,
  errorExtra,
  ...rest
}: ErrorProps): JSX.Element {
  const theme = useTheme();

  return (
    <>
      {!hidden ? (
        <View
          {...containerProps}
          style={[styles.containerStyles, containerProps?.style]}
        >
          {errors
            ? errors.map(error => (
                <View
                  {...wrapperProps}
                  style={[{ flexDirection: "row" }, wrapperProps?.style]}
                  key={error}
                >
                  {showIcon ? (
                    <WarningExclamation
                      accessibilityElementsHidden
                      color={theme.colors["red-700"]}
                      {...iconProps}
                      style={[styles.iconStyles, iconProps?.style]}
                    />
                  ) : null}

                  <Text
                    {...rest}
                    key={error}
                    style={[styles.errorText, style]}
                    color="red-700"
                  >
                    {error}
                  </Text>
                </View>
              ))
            : null}
          {errorExtra}
        </View>
      ) : null}
    </>
  );
}

Errors.displayName = "Errors";

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
  },
  iconStyles: {
    marginRight: 4,
  },
});
