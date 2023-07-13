import React, { useEffect } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { debounce } from "lodash";
import { StateAndCitySuggestion } from "@models/StateAndCitySuggestion";

import {
  RadioButton,
  RadioButtonProps,
  RadioGroup,
  RadioGroupProps,
  useRadio,
} from "../Radio";

import {
  SuggestionError,
  SuggestionErrorProps,
  SuggestionLoading,
  SuggestionLoadingProps,
  SuggestionNotFound,
  SuggestionNotFoundProps,
} from "./utilities";
import { useZipInputContext } from "./context";
import { UseZipSuggestions, useZipSuggestions } from "./useZipSuggestions";

type ZipCodeSuggestionsProps = {
  zipSuggestions?: UseZipSuggestions;
  containerProps?: ViewProps;
  suggestionLoadingProps?: SuggestionLoadingProps;
  suggestionErrorProps?: SuggestionErrorProps;
  suggestionNotFoundProps?: SuggestionNotFoundProps;
  radioGroupProps?: RadioGroupProps;
  radioButtonProps?: RadioButtonProps;
  refetchDelay?: number;
  onChange?: (value: StateAndCitySuggestion) => void;
};

export function ZipCodeSuggestions({
  zipSuggestions: controlledZipSuggestions,
  containerProps,
  suggestionLoadingProps,
  suggestionErrorProps,
  suggestionNotFoundProps,
  radioGroupProps,
  radioButtonProps,
  refetchDelay = 100,
  onChange,
}: ZipCodeSuggestionsProps): JSX.Element {
  const internalZipSuggestions = useZipSuggestions();
  const suggestions = controlledZipSuggestions ?? internalZipSuggestions;
  const radio = useRadio();
  const context = useZipInputContext();
  const refetch = debounce((zip: string | null) => {
    if (zip && zip.length >= 5) {
      suggestions.mutate(zip);
    }
  }, refetchDelay);

  function handleUpdate(event: unknown): void {
    if (suggestions.data && typeof event === "number") {
      const item = suggestions.data[event];
      if (!item) {
        throw new Error(
          "A zip code was selected that is not within the request array.",
        );
      }
      context.onUpdate(item.zipCode);
      radioGroupProps?.inputProps?.onUpdate?.(item.zipCode);
      onChange?.(item);
    }
  }

  useEffect(
    function handleSyncValue() {
      return context.store.subscribe(state => {
        const radioState = radio.store.get();
        const suggestion = suggestions.data?.[radioState.selected as number];
        if (suggestion?.zipCode !== state.value) {
          radio.store.set({ selected: null });
          refetch(state.value);
        }
      });
    },
    [context.store, radio, refetch, suggestions],
  );

  useEffect(
    function handleInitialLoadValue() {
      return context.store.subscribe(state => {
        if (state.value && suggestions.isIdle) {
          refetch(state.value);
        }
      });
    },
    [context.store, refetch, suggestions],
  );

  return (
    <View
      {...containerProps}
      style={[styles.suggestionContainer, containerProps?.style]}
    >
      {suggestions.isSuccess ? (
        suggestions.data.length ? (
          <RadioGroup
            hideLabel
            label="Zip/Postal code suggestions"
            radio={radio}
            {...radioGroupProps}
            inputProps={{ onUpdate: handleUpdate }}
            containerProps={{ style: { marginBottom: 0 } }}
          >
            {suggestions.data.map((item, index) => (
              <RadioButton
                {...radioButtonProps}
                value={index}
                key={`${item.zipCode} - ${item.city}, ${item.state}`}
                label={`${item.zipCode} - ${item.city}, ${item.state}`}
              />
            ))}
          </RadioGroup>
        ) : (
          <SuggestionNotFound {...suggestionNotFoundProps} />
        )
      ) : suggestions.isLoading ? (
        <SuggestionLoading {...suggestionLoadingProps} />
      ) : suggestions.isError ? (
        <SuggestionError {...suggestionErrorProps} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
});
