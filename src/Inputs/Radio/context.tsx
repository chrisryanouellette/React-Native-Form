import { createContext, useContext } from "react";

import { UseRadio } from "./useRadio";

type RadioContextType = UseRadio & {
  onUpdate: (value: unknown) => void;
};

export const RadioContext = createContext<RadioContextType | null>(null);

export function useRadioContext(): RadioContextType {
  const context = useContext(RadioContext);

  if (!context) {
    throw new Error(
      "useRadioContext can only be used within a <RadioContext.Provider>",
    );
  }

  return context;
}
