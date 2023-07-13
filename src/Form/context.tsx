import React, { createContext, ReactNode, useContext } from "react";

import { GenericFields, UseForm } from "./useForm";

type FormContextType<Fields extends GenericFields> = UseForm<Fields>;

const FormContext = createContext<FormContextType<any> | null>(null);

export type FormProviderProps<Fields extends GenericFields> = {
  children?: ReactNode;
  value: FormContextType<Fields>;
};

export const FormProvider = <Fields extends GenericFields>({
  children,
  value,
}: FormProviderProps<Fields>): JSX.Element => {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = <
  Fields extends GenericFields = GenericFields,
>(): FormContextType<Fields> => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext can only be used within a <Form> element.");
  }

  return context;
};

export type FormItemContextType = {
  name: string;
};

const FormItemContext = createContext<FormItemContextType | null>(null);

type FormItemProviderProps = {
  value: FormItemContextType;
  children?: ReactNode;
};

export function FormItemProvider({
  children,
  value,
}: FormItemProviderProps): JSX.Element {
  return (
    <FormItemContext.Provider value={value}>
      {children}
    </FormItemContext.Provider>
  );
}

/** Not all form items are withing a Item so the context value maybe null */
export function useFormItemContext(): FormItemContextType {
  const context = useContext(FormItemContext);

  if (!context) {
    throw new Error(
      "<Form.Group> can only be used within a <Form.Item> component.",
    );
  }

  return context;
}
