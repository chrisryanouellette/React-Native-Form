import { UseCreateStore, useCreateStore } from "@src/helpers/store";
import { useCallback, useMemo } from "react";

export type RadioStore = {
  inputs: Set<string>;
  selected: unknown;
};

export type UseRadio = {
  store: UseCreateStore<RadioStore>;
  register: (id: string) => () => void;
};

export function useRadio(): UseRadio {
  const store = useCreateStore<RadioStore>({ selected: "", inputs: new Set() });

  const register = useCallback<UseRadio["register"]>(
    function handleRegister(id) {
      store.set({ inputs: store.get().inputs.add(id) });
      return function handleUnregister(): void {
        const inputs = store.get().inputs;
        inputs.delete(id);
        store.set({ inputs });
      };
    },
    [store],
  );

  return useMemo(() => ({ store, register }), [register, store]);
}
