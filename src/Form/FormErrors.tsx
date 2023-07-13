import React from "react";
import { useStore } from "@src/helpers/store";
import { StyleSheet, View, ViewProps } from "react-native";
import { TextThemeProps, useTheme } from "@src/theme-provider";
import WarningExclamation from "@components/Svg/WarningExclamation";
import { SvgProps } from "@components/Svg/models";

import Text from "../Text";

import { useFormContext } from "./context";
import { FormState } from "./useForm";

function handleSelectHasError(state: FormState): boolean {
  return state.status === "failed";
}

type FormErrorsProps = TextThemeProps & {
  hideIcon?: boolean;
  iconProps?: SvgProps;
  containerProps?: ViewProps;
};

export function FormErrors({
  hideIcon,
  iconProps,
  containerProps,
  color,
  ...rest
}: FormErrorsProps): JSX.Element {
  const context = useFormContext();
  const hasError = useStore(context.state, handleSelectHasError);
  const theme = useTheme();

  return (
    <>
      {hasError ? (
        <View
          {...containerProps}
          style={[styles.containerStyles, containerProps?.style]}
        >
          {!hideIcon ? (
            <WarningExclamation
              accessibilityElementsHidden
              color={theme.colors["red-600"]}
              {...iconProps}
              style={[styles.iconStyles, iconProps?.style]}
            />
          ) : null}
          {[...context.state.get().errors].map(error => {
            return (
              <Text {...rest} key={error} color={color ?? "red-700"}>
                {error}
              </Text>
            );
          })}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyles: {
    marginRight: 2,
  },
});
