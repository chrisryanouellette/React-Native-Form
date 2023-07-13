import { useCallback, useMemo, useRef } from "react";
import { ReadOnlyUseCreateStore, useCreateStore } from "@src/helpers/store";
import { callFunctionOrPromise } from "@src/helpers/call";

import { FormFieldsActions, reducer, reducerActions } from "./reducers";

export const formEvents = {
  update: "update",
  finish: "finish",
  finishFailed: "finishFailed",
  statusChange: "statusChange",
} as const;

type FormEvents = typeof formEvents;

export type UpdateEvent<Fields extends GenericFields> = (
  name: keyof Fields,
  value: Fields[typeof name],
  form: FormFields<Fields>,
) => void;

export type FinishEvent<Fields extends GenericFields> = (
  fields: FormFields<Fields>,
  addFormError: ValidationAddError,
) => void;

export type FinishFailedEvent<Fields extends GenericFields> = (
  invalid: Extract<keyof Fields, string>[],
  fields: FormFields<Fields>,
) => void;

export type StatusChangeEvent = (status: FormStatus) => void;

type Subscriptions<Fields extends GenericFields> = {
  [formEvents.update]: UpdateEvent<Fields>;
  [formEvents.finish]: FinishEvent<Fields>;
  [formEvents.finishFailed]: FinishFailedEvent<Fields>;
  [formEvents.statusChange]: StatusChangeEvent;
};

export type GenericFields = { [field: string]: unknown };

export type FormGroup<Values extends GenericFields> = {
  [id: string]: FormFields<Values>;
};

export type FormField<Value> = {
  value: Value;
  defaultValue?: Value;
  edited: boolean;
  errors: Set<string>;
};

export type FormFields<Fields extends GenericFields> = {
  [K in keyof Fields]: FormField<Fields[K]>;
};

export type FormFieldsState = FormFields<GenericFields>;

export type FormStatus = "idle" | "submitting" | "failed" | "success";

export type FormState = {
  status: FormStatus;
  errors: Set<string>;
};

export type ValidationAddError = (error: string) => void;

export type ValidationFn<Value, Fields extends GenericFields, Return = void> = (
  name: any,
  field: FormField<Value>,
  add: ValidationAddError,
  form: FormFields<Fields>,
) => Return;
export type AsyncValidationFn<
  Value,
  Fields extends GenericFields,
> = ValidationFn<Value, Fields, Promise<void>>;
export type Validation<Value, Fields extends GenericFields = GenericFields> =
  | ValidationFn<Value, Fields>
  | AsyncValidationFn<Value, Fields>;

export type UseForm<Fields extends GenericFields = GenericFields> = {
  fields: ReadOnlyUseCreateStore<FormFields<Fields>>;
  state: ReadOnlyUseCreateStore<FormState>;
  /**
   * Stores a form field into the form instance's store.
   * Returns the unregister function
   */
  register: <K extends keyof Fields>(
    name: Extract<K, string>,
    defaultValue?: unknown,
  ) => () => void;
  /**
   * Set's the field value in the store and marks it as edited.
   *
   * Note: This will NOT cause the form field to update.
   * If a field needs to display the value use `set` instead.
   */
  setValue: <K extends keyof Fields>(
    name: Extract<K, string>,
    value: Fields[K],
  ) => void;
  /**
   * Set's many fields value and marks each field as edited.
   *
   * Note: This will NOT cause the form field to update.
   * If a field needs to display the value use `setMany` instead.
   */
  setManyValue: <K extends keyof Fields>(
    arg: Partial<Record<Extract<K, string>, Fields[K]>>,
  ) => void;
  /**
   * Set's the input's value, default value and the value if the current value is null.
   */
  set: <K extends keyof Fields>(
    name: Extract<K, string>,
    value: Fields[K],
  ) => void;
  /** Set's the input's value, default value, and the value if the current value is null. */
  setMany: <K extends keyof Fields>(
    arg: Partial<Record<Extract<K, string>, Fields[K]>>,
  ) => void;
  setMetadata: <K extends keyof Fields>(
    name: Extract<K, string>,
    metadata: {
      defaultValue?: Fields[K];
      edited?: boolean;
      errors?: Set<string>;
    },
  ) => void;
  /**
   * Adds a validation function to a field.
   * Returns the cleanup function to remove the function so
   * it is not run when the form is submitted.
   */
  validation: <K extends keyof Fields>(
    name: Extract<K, string>,
    fns: Validation<unknown, Fields>,
  ) => () => void;
  /**
   * Validates a form field, throws an error of errors if there where any.
   */
  validate: <K extends keyof Fields>(
    name: Extract<K, string>,
  ) => Promise<Extract<K, string> | void>;
  submit: () => Promise<void>;
  setFormError: (errors: string | string[]) => void;
  subscribe: <E extends keyof FormEvents>(
    event: E,
    fn: Subscriptions<Fields>[E],
  ) => () => void;
};

const initial = {};

/**
 * Create a new form store with all the attached methods for manipulating the form
 *
 * @example
 * const form = Form.useForm();
 *
 * useEffect(() => {
 *  form.set("firstName", "WSS")
 * }, [form])
 *
 * // Make sure to pass `form` to the `<Form>` component
 * return <Form form={form}>
 *    <Form.Item name="firstName">
 *      <Form.TextInput label="First Name" />
 *    </Form.Item>
 *  </Form>
 */
export function useForm<Fields extends GenericFields>(): UseForm<Fields> {
  type TypedForm = UseForm<Fields>;
  const fields = useCreateStore<FormFields<Fields>, FormFieldsActions>(
    initial as FormFields<Fields>,
    reducer,
  );
  const state = useCreateStore<{ status: FormStatus; errors: Set<string> }>({
    status: "idle",
    errors: new Set(),
  });
  const subscriptions = useRef<{
    [K in keyof typeof formEvents]: Set<Subscriptions<Fields>[K]>;
  }>({
    update: new Set(),
    finish: new Set(),
    finishFailed: new Set(),
    statusChange: new Set(),
  });
  const validations = useRef<
    Partial<{
      [K in keyof Fields]: Set<Parameters<UseForm<Fields>["validation"]>[1]>;
    }>
  >({});

  const updateStatus = useCallback<(status: FormStatus) => void>(
    newStatus => {
      state.set({ status: newStatus });
      subscriptions.current.statusChange.forEach(cb => cb(newStatus));
    },
    [state],
  );

  const register = useCallback<TypedForm["register"]>(
    function (name, defaultValue) {
      fields.set({
        action: reducerActions.register,
        value: { name, value: defaultValue, defaultValue },
      });
      return () => {
        fields.set({
          action: reducerActions.unregister,
          value: { name },
        });
      };
    },
    [fields],
  );

  const subscribe = useCallback<UseForm<Fields>["subscribe"]>((event, fn) => {
    subscriptions.current[event].add(fn);
    return () => subscriptions.current[event].delete(fn);
  }, []);

  const setValue = useCallback<UseForm<Fields>["setValue"]>(
    (name, value) => {
      fields.set({
        action: reducerActions.set,
        value: {
          name,
          value,
        },
      });
      subscriptions.current.update.forEach(sub =>
        sub(name, value, fields.get()),
      );
    },
    [fields],
  );

  const setManyValue = useCallback<UseForm<Fields>["setManyValue"]>(
    value => {
      fields.set({
        action: reducerActions.setMany,
        value,
      });
    },
    [fields],
  );

  const set = useCallback<UseForm<Fields>["set"]>(
    (name, defaultValue) => {
      fields.set({
        action: reducerActions.setDefault,
        value: {
          name,
          defaultValue,
        },
      });
    },
    [fields],
  );

  const setMany = useCallback<UseForm<Fields>["setMany"]>(
    value => {
      fields.set({
        action: reducerActions.setDefaultMany,
        value,
      });
    },
    [fields],
  );

  const setMetadata = useCallback<UseForm<Fields>["setMetadata"]>(
    (name, metadata) => {
      fields.set({
        action: reducerActions.setMetadata,
        value: {
          name,
          metadata,
        },
      });
    },
    [fields],
  );

  const validation = useCallback<UseForm<Fields>["validation"]>((name, fns) => {
    const validationSubs = validations.current[name] ?? new Set();
    if (!validations.current[name]) {
      validations.current[name] = validationSubs;
    }
    validationSubs.add(fns);
    /** Remove validation functions as cleanup */
    return () => {
      validationSubs.delete(fns);
    };
  }, []);

  const validate = useCallback<TypedForm["validate"]>(
    async name => {
      const fieldValidations = validations.current[name];
      const field = fields.get()[name];
      const errors: Set<string> = new Set();

      if (fieldValidations?.size) {
        callFunctionOrPromise(
          [...fieldValidations],
          name,
          field,
          (error: string): void => {
            errors.add(error);
          },
          fields.get(),
        );
        fields.set({
          action: reducerActions.validate,
          value: { name, errors },
        });
        if (errors.size) {
          return name;
        }
      }
    },
    [fields],
  );

  const submit = useCallback<TypedForm["submit"]>(async () => {
    const results = (await Promise.all(
      Object.keys(fields.get()).map(async key => {
        return validate(key);
      }),
    )) as (Extract<keyof Fields, string> | void)[];
    const invalid: Extract<keyof Fields, string>[] = [];
    results.forEach(name => {
      if (name) {
        invalid.push(name);
      }
    });
    if (invalid.length) {
      subscriptions.current.finishFailed.forEach(fn =>
        fn(invalid, fields.get()),
      );
    } else {
      updateStatus("submitting");
      const errors = state.get().errors;
      errors.clear();
      await callFunctionOrPromise(
        [...subscriptions.current.finish],
        fields.get(),
        (error: string): void => {
          errors.add(error);
        },
      );
      if (errors.size) {
        updateStatus("failed");
      } else {
        updateStatus("success");
      }
    }
  }, [fields, state, updateStatus, validate]);

  const setFormError = useCallback<UseForm<Fields>["setFormError"]>(
    update => {
      const errors = state.get().errors;
      errors.clear();
      Array.isArray(update)
        ? update.forEach(err => errors.add(err))
        : errors.add(update);
      updateStatus("failed");
    },
    [state, updateStatus],
  );

  return useMemo(
    () => ({
      fields,
      state,
      register,
      subscribe,
      validate,
      validation,
      set,
      setMany,
      setValue,
      setManyValue,
      setMetadata,
      submit,
      setFormError,
    }),
    [
      fields,
      state,
      register,
      subscribe,
      validate,
      validation,
      set,
      setMany,
      setValue,
      setManyValue,
      setMetadata,
      submit,
      setFormError,
    ],
  );
}
