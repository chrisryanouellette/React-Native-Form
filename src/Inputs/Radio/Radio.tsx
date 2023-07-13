import React, { useEffect } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { useStore } from "@src/helpers/store";
import { useTheme } from "@src/theme-provider";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { useUuid } from "@src/hooks/useUuid";

import { Label, LabelProps } from "../Utilities";

import { useRadioContext } from "./context";
import { RadioStore } from "./useRadio";

function selectSelected(state: RadioStore): unknown {
  return state.selected;
}

function selectNumOfInputs(state: RadioStore): unknown {
  return state.inputs.size;
}

export type RadioButtonProps = {
  value: unknown;
  label: string;
  id?: string;
  helperText?: string;
  hideLabel?: boolean;
  labelProps?: LabelProps;
  containerProps?: PressableProps;
  inputContainerProps?: ViewProps;
  inputProps?: ViewProps & { duration?: number };
  testID?: string;
};

export function RadioButton({
  value,
  label,
  id: controlledId,
  helperText,
  hideLabel,
  labelProps,
  containerProps,
  inputContainerProps,
  inputProps,
  testID,
}: RadioButtonProps): JSX.Element {
  const theme = useTheme();
  const internalId = useUuid();
  const id = controlledId ?? internalId;
  const context = useRadioContext();
  const selected = useStore(context.store, selectSelected);
  const checked = selected === value;
  const numOfInputs = useStore(context.store, selectNumOfInputs);
  const index = Array.from(context.store.get().inputs).indexOf(id) + 1;
  const accessibilityLabel = `${label} ${
    index && numOfInputs ? `- ${index} of ${numOfInputs}` : ""
  }`;

  function handleChange(): void {
    context.onUpdate(value);
  }

  useEffect(
    function handleRegisterRadioInput() {
      return context.register(id);
    },
    [context, id],
  );

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={{ checked }}
      testID={`${testID} isChecked: ${checked}`}
      {...containerProps}
      style={args => [
        styles.container,
        {
          backgroundColor: args.pressed
            ? theme.colors["gray-100"]
            : "transparent",
        },
        typeof containerProps?.style === "function"
          ? containerProps.style(args)
          : containerProps?.style,
      ]}
      onPress={handleChange}
    >
      <View
        {...inputContainerProps}
        style={[
          styles.inputContainer,
          {
            borderColor: checked
              ? theme.colors["brand-primary-green"]
              : theme.colors["gray-600"],
            backgroundColor: "#fff",
          },
          inputContainerProps?.style,
        ]}
      >
        {checked ? (
          <Animated.View
            {...inputProps}
            entering={ZoomIn.duration(inputProps?.duration ?? 200)}
            exiting={ZoomOut.duration(inputProps?.duration ?? 200)}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors["brand-primary-green"],
                borderColor: "#fff",
              },
            ]}
          />
        ) : null}
      </View>
      {!hideLabel ? (
        <Label
          helperText={helperText}
          {...labelProps}
          containerProps={{
            ...labelProps?.containerProps,
            style: [styles.label, labelProps?.containerProps?.style],
          }}
        >
          {label}
        </Label>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    marginBottom: 0,
  },
  inputContainer: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    width: 24,
    height: 24,
    borderRadius: 99,
    marginRight: 8,
  },
  input: {
    width: "100%",
    height: "100%",
    borderRadius: 500,
    borderWidth: 3,
  },
});
