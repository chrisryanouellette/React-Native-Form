import { StateAndCitySuggestion } from "@models/StateAndCitySuggestion";
import baseFetch from "@src/baseFetch";
import { argoURL } from "@src/domain/argoURL";
import { UseMutationResult, useMutation } from "@tanstack/react-query";

async function stateAndZipSuggestionRequest(
  zip: string,
): Promise<StateAndCitySuggestion[]> {
  const response = await baseFetch(
    `${argoURL}/zipcodeverification?zipcode=${zip}`,
  );

  return response.json();
}

export type UseZipSuggestions = UseMutationResult<
  StateAndCitySuggestion[],
  unknown,
  string,
  unknown
>;

export function useZipSuggestions(): UseZipSuggestions {
  return useMutation({ mutationFn: stateAndZipSuggestionRequest });
}
