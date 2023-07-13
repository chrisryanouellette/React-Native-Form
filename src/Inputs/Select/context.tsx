import { createContext, useContext } from "react";
import { UseCreateStore } from "@src/helpers/store";

export type SelectStore = {
  isOpen: boolean;
  value: string | number | Set<string | number> | null;
};

export type SelectContextType = {
  store: UseCreateStore<SelectStore>;
  onUpdate: (value: string | number) => void;
};

export const SelectContext = createContext<SelectContextType | null>(null);

export function useSelectContext(): SelectContextType {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error(
      "useSelectContext can only be used within a <SelectContext.Provider>",
    );
  }

  return context;
}
