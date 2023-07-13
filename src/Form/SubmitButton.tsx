import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";
import Button, { ButtonProps } from "@components/Button";
import { TextThemeProps, useTheme } from "@src/theme-provider";

import Text from "../Text";

import { useFormContext } from "./context";
import { FormStatus } from "./useForm";

type SubmitButtonProps = Partial<ButtonProps> & {
  textProps?: TextThemeProps;
  status?: FormStatus;
  activityIndicatorProps?: ActivityIndicatorProps;
};

/**
 * Handles submitting a form.
 *
 * @example
 * <Form onFinish={handleFinish}>
 *  <Form.Item name="firstName">
 *    <Form.TextInput label="First Name" />
 *  </Form.Item>
 *  <Form.SubmitButton>Update</Form.SubmitButton>
 * <Form>
 */
export function SubmitButton({
  activityIndicatorProps,
  children,
  status: controlledStatus,
  textProps,
  onPress,
  ...rest
}: SubmitButtonProps): JSX.Element {
  const theme = useTheme();
  const context = useFormContext();
  const status = controlledStatus ?? context.state.get().status;

  function handlePress(event: GestureResponderEvent): void {
    onPress?.(event);
    context.submit();
  }

  return (
    <Button
      color={theme.colors["green-700"]}
      pressedColor={theme.colors["green-800"]}
      {...rest}
      onPress={handlePress}
    >
      {status === "submitting" ? (
        <ActivityIndicator
          accessibilityHint="loading"
          color="white"
          size="small"
          accessibilityLabel="Loading"
          accessibilityState={{ busy: true }}
          {...activityIndicatorProps}
        />
      ) : (
        <Text
          {...textProps}
          color={textProps?.color ?? "gray-100"}
          variant="bold"
          style={[styles.textStyles, textProps?.style]}
        >
          {children}
        </Text>
      )}
    </Button>
  );
}

const styles = StyleSheet.create({
  textStyles: {
    fontSize: 18,
  },
});
