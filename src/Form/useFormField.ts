import {
  ReadOnlyUseCreateStore,
  SelectorFn,
  useStore,
} from "@src/helpers/store";

import { FormFields, GenericFields } from "./useForm";

/**
 * Sets up a state for a form field with an optional selector
 *
 * @example
 * const form = Form.useContext();
 * const field = Form.useField(form, "firstName");
 */
export function useFormField<Store extends GenericFields, Selected = Store>(
  fields: ReadOnlyUseCreateStore<FormFields<Store>>,
  selector?: SelectorFn<FormFields<Store>, Selected>,
): Selected {
  return useStore<FormFields<Store>, Selected>(fields, selector);
}
