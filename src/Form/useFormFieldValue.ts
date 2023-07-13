import { useStore } from "@src/helpers/store";

import { FormFields, GenericFields, UseForm } from "./useForm";

/**
 * Sets up a state for a form field's value. This will only re-render when the value changes.
 *
 * @example
 * const form = Form.useContext();
 * const firstName = Form.useFieldValue(form, "firstName");
 */
export function useFormFieldValue<
  Store extends GenericFields,
  Key extends keyof Store,
>(form: UseForm<Store>, name: Key): Store[typeof name] {
  return useStore<FormFields<Store>, Store[typeof name]>(
    form.fields,
    function selectFormFieldValue(state: FormFields<Store>) {
      return state[name]?.value;
    },
  );
}
