import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { SvgProps } from "@components/Svg/models";
import { TextThemeProps, useTheme } from "@src/theme-provider";
import WarningIcon from "@components/Svg/WarningLineIcon";
import Text from "@components/common/Text";
import WarningFilledIcon from "@components/Svg/WarningFilledIcon";

export type SuggestionErrorProps = {
  containerProps?: ViewProps;
  iconProps?: SvgProps;
  textProps?: TextThemeProps;
};

export function SuggestionError({
  containerProps,
  iconProps,
  textProps,
}: SuggestionErrorProps): JSX.Element {
  const theme = useTheme();
  return (
    <View {...containerProps} style={[styles.container, containerProps?.style]}>
      <WarningIcon
        color={theme.colors["brand-pricing"]}
        size={20}
        {...iconProps}
      />
      <Text {...textProps} style={[styles.text, textProps?.style]}>
        Could not load zip code suggestions
      </Text>
    </View>
  );
}

export type SuggestionLoadingProps = {
  containerProps?: ViewProps;
  activityIndicatorProps?: ActivityIndicatorProps;
  textProps?: TextThemeProps;
};

export function SuggestionLoading({
  containerProps,
  activityIndicatorProps,
  textProps,
}: SuggestionLoadingProps): JSX.Element {
  const theme = useTheme();
  return (
    <View {...containerProps} style={[styles.container, containerProps?.style]}>
      <ActivityIndicator
        color={theme.colors["brand-primary-green"]}
        size="small"
        accessibilityRole="alert"
        accessibilityLabel="loading"
        accessibilityState={{ busy: true }}
        {...activityIndicatorProps}
      />
      <Text {...textProps} style={[styles.text, textProps?.style]}>
        Loading suggestions
      </Text>
    </View>
  );
}

export type SuggestionNotFoundProps = {
  containerProps?: ViewProps;
  iconProps?: SvgProps;
  textProps?: TextThemeProps;
};

export function SuggestionNotFound({
  containerProps,
  iconProps,
  textProps,
}: SuggestionNotFoundProps): JSX.Element {
  const theme = useTheme();
  return (
    <>
      <WarningFilledIcon
        color={theme.colors["red-600"]}
        size={20}
        {...iconProps}
      />
      <View
        {...containerProps}
        style={[styles.container, containerProps?.style]}
      >
        <View>
          <Text
            color="red-600"
            {...textProps}
            style={[styles.text, textProps?.style]}
          >
            Oops! No zip code suggestions available
          </Text>
          <Text
            color="red-600"
            {...textProps}
            style={[styles.text, textProps?.style]}
          >
            Please enter the city &amp; state manually.
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 8,
  },
});
