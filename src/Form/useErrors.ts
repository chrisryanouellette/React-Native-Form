import { useStore } from "@src/helpers/store";

import { FormFieldsState, GenericFields, UseForm } from "./useForm";

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

/** Returns any errors for a specific field.
 *
 * This can only be used when there is a parent <Form> component.
 *
 * This is most useful when you want to display an error somewhere else from
 * where the field is being rendered.
 *
 * @example
 * const form = Form.useContext()
 * const errors = Form.useErrors(form, "firstName");
 *
 * return <Errors errors={Array.from(errors)} />
 */
export function useFormErrors<Fields extends GenericFields>(
  form: UseForm<Fields>,
  field: Extract<keyof Fields, string>,
): Set<string> {
  return useStore<FormFieldsState, Set<string>>(form.fields, (...args) =>
    selectFieldErrors(field, ...args),
  );
}
