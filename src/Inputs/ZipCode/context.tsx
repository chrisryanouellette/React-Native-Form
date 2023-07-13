import { UseCreateStore } from "@src/helpers/store";
import { createContext, useContext } from "react";

export type ZipInputStore = {
  value: string | null;
};

type ZipInputContextType = {
  store: UseCreateStore<ZipInputStore>;
  onUpdate: (value: string) => void;
};

export const ZipInputContext = createContext<ZipInputContextType | null>(null);

export function useZipInputContext(): ZipInputContextType {
  const context = useContext(ZipInputContext);

  if (!context) {
    throw new Error(
      "useZipInputContext can only be used within a <ZipInputContext.Provider>",
    );
  }

  return context;
}
