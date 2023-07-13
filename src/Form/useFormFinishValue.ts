import { useEffect, useState } from "react";

import { GenericFields, UseForm } from "./useForm";

/**
 * Sets up a state for a form field's value that is only updated when
 * the form is successfully submitted.
 *
 * In the event the form fails to submit, the fallback value will be used.
 *
 * @example
 * const form = Form.useContext();
 * const firstName = Form.useFinishedValue(form, "firstName");
 */
export function useFormFinishedValue<
  Store extends GenericFields,
  Key extends keyof Store,
>(
  form: UseForm<Store>,
  name: Extract<Key, string>,
  fallback?: Store[typeof name],
): Store[typeof name] {
  const [value, setValue] = useState(form.fields.get()[name]?.value);

  useEffect(
    function updateFormFinishValue() {
      return form.subscribe(
        "finish",
        function handleUpdateFormFinishValue(state) {
          setValue(state[name].value);
        },
      );
    },
    [form, name],
  );

  useEffect(() => {
    return form.subscribe(
      "finishFailed",
      function handleUpdateFormFinishValue(fields) {
        if (fallback !== undefined && fields.includes(name)) {
          setValue(fallback);
        }
      },
    );
  });

  return value;
}
