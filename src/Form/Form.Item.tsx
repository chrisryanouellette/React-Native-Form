import React, {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { TextInputProps } from "react-native";
import { isElement } from "@src/helpers/element";
import { useStore } from "@src/helpers/store";

import { InputEvents } from "../Inputs";

import { FormItemProvider, useFormContext } from "./context";
import {
  FormFields,
  FormFieldsState,
  GenericFields,
  Validation,
} from "./useForm";

const ComposedInputs = [
  "TextInput",
  "CurrencyInput",
  "ZipCodeInput",
  "PhoneInput",
  "SelectInput",
  "NumberInput",
  // "DateInput",
  "CheckboxInput",
  "RadioGroup",
  // "FileInput",
];

function selectFieldErrors(
  name: string,
  state: FormFieldsState,
  prev: Set<string> | null,
): Set<string> {
  const value = state[name]?.errors ?? new Set();
  if (!prev) {
    return value;
  }
  if (prev.size !== value.size) {
    return value;
  }
  if ([...prev].some(item => !value.has(item))) {
    return new Set(value);
  }
  return prev;
}

type FormItemProps<Field, Fields extends GenericFields, Name extends string> = {
  name: string;
  defaultValue?: unknown;
  required?: boolean;
  persist?: boolean;
  children?: ReactNode;
  onChange?: (name: Name, value: Field, form: FormFields<Fields>) => void;
  validation?: Validation<Field, Fields>;
};

export function FormItem<
  Field,
  Fields extends GenericFields,
  Name extends string,
>({
  name,
  defaultValue: controlledDefaultValue,
  required,
  persist,
  children,
  onChange,
  validation: validationFn,
}: FormItemProps<Field, Fields, Name>): JSX.Element {
  const context = useFormContext();
  const errors = useStore<FormFieldsState, Set<string>>(
    context.fields,
    (...args) => selectFieldErrors(name, ...args),
  );
  const defaultValue =
    controlledDefaultValue ??
    context.fields.get()?.[name]?.defaultValue ??
    undefined;

  /*
    Triggers a state update if the input has gone from no default value
    to having a default value.
    This occurs when some asynchronous action updates the form's state,
    or when the first change is made.
  */
  useStore(context.fields, function (state) {
    const update = state[name]?.defaultValue ?? null;
    return update !== null;
  });

  const formItemContextValue = useMemo(() => ({ name }), [name]);

  const handleChange = useCallback<(value: unknown) => void>(
    function (update) {
      context.setValue(name, update);
      onChange?.(
        name as Name,
        update as Field,
        context.fields.get() as FormFields<Fields>,
      );
    },
    [context, name, onChange],
  );

  useEffect(() => {
    const unsub = context.register(name, defaultValue);
    return function formItemRegisterCleanup() {
      if (!persist) {
        unsub();
      }
    };
  }, [context, defaultValue, name, persist]);

  useEffect(() => {
    if (validationFn) {
      return context.validation(name, validationFn as Validation<unknown>);
    }
  }, [context, name, validationFn]);

  return (
    <FormItemProvider value={formItemContextValue}>
      {Children.map(children, function renderFormItemChildren(child) {
        if (isValidElement(child)) {
          /** @note the generic here may need to be updated as we build inputs */
          const inputProps: InputEvents<TextInputProps> = {
            // id,

            // "aria-invalid": !!errors.size,
            // "aria-describedby": errorsId,
            defaultValue: defaultValue as string,
            onUpdate: handleChange,
          };
          const labelProps = {
            required,
            // htmlFor: id,
          };
          const errorProps = {
            // id: errorsId,
            errors: Array.from(errors),
          };
          if (isElement(child, ComposedInputs)) {
            return cloneElement(child, {
              ...child.props,
              state: errors.size ? "error" : "",
              inputProps: {
                ...child.props.inputProps,
                ...inputProps,
              },
              labelProps: {
                ...child.props.labelProps,
                ...labelProps,
              },
              errorProps: {
                ...child.props.errorProps,
                ...errorProps,
              },
            });
          }
        }
        return child;
      })}
    </FormItemProvider>
  );
}
