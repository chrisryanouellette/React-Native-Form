import React, { ReactNode, useEffect } from "react";

import { TextInput } from "../Inputs";
import { CurrencyInput } from "../Inputs/Currency";
import { CheckboxInput } from "../Inputs/Checkbox";
import { ZipCodeInput } from "../Inputs/ZipCode";
import { RadioButton, RadioGroup } from "../Inputs/Radio";
import { PhoneInput } from "../Inputs/Phone";
import { SelectInput, SelectItem, SelectModalHeader } from "../Inputs/Select";
import { ZipCodeSuggestions } from "../Inputs/ZipCode/Suggestions";
import { useZipSuggestions } from "../Inputs/ZipCode/useZipSuggestions";
import { NumberInput } from "../Inputs/Number";

import {
  FinishEvent,
  FinishFailedEvent,
  GenericFields,
  UpdateEvent,
  UseForm,
  useForm,
} from "./useForm";
import { FormProvider, useFormContext } from "./context";
import { FormItem } from "./Form.Item";
import { FormErrors } from "./FormErrors";
import { SubmitButton } from "./SubmitButton";
import { useFormErrors } from "./useErrors";
import { useFormField } from "./useFormField";
import { useFormFieldValue } from "./useFormFieldValue";
import { useFormFinishedValue } from "./useFormFinishValue";
import { FormGroup } from "./Form.Group";

type FormProps<Fields extends GenericFields> = {
  form?: UseForm<Fields>;
  onUpdate?: UpdateEvent<Fields>;
  /**
   * Runs after the form has been submitted and validations function have passed
   * @note This function should be memoized
   */
  onFinish?: FinishEvent<Fields>;
  /**
   * Runs after the form has been submitted and some validations function failed
   * @note This function should be memoized
   */
  onFinishFailed?: FinishFailedEvent<Fields>;
  children?: ReactNode;
};

export function Form<Fields extends GenericFields = GenericFields>({
  form: controlledForm,
  onUpdate,
  onFinish,
  onFinishFailed,
  children,
}: FormProps<Fields>): JSX.Element {
  const internalForm = useForm<Fields>();
  const form = controlledForm ?? internalForm;

  useEffect(
    function setupFormSubscriptions() {
      const unsubscribes: (() => void)[] = [];
      if (onUpdate) {
        unsubscribes.push(form.subscribe("update", onUpdate));
      }
      if (onFinish) {
        unsubscribes.push(form.subscribe("finish", onFinish));
      }
      if (onFinishFailed) {
        unsubscribes.push(form.subscribe("finishFailed", onFinishFailed));
      }
      return function cleanupFormSubscriptions() {
        unsubscribes.forEach(unsub => unsub());
      };
    },
    [form, onFinish, onFinishFailed, onUpdate],
  );

  return <FormProvider value={form}>{children}</FormProvider>;
}

Form.useForm = useForm;
Form.useFormContext = useFormContext;
Form.useField = useFormField;
Form.useFieldValue = useFormFieldValue;
Form.useErrors = useFormErrors;
Form.useContext = useFormContext;
Form.useFinishedValue = useFormFinishedValue;
Form.Item = FormItem;
Form.Group = FormGroup;
Form.TextInput = TextInput;
Form.NumberInput = NumberInput;
Form.CurrencyInput = CurrencyInput;
Form.PhoneInput = PhoneInput;
Form.ZipCodeInput = ZipCodeInput;
Form.ZipCodeSuggestions = ZipCodeSuggestions;
Form.useZipSuggestions = useZipSuggestions;
Form.Select = SelectInput;
Form.SelectItem = SelectItem;
Form.SelectHeader = SelectModalHeader;
Form.Checkbox = CheckboxInput;
Form.RadioGroup = RadioGroup;
Form.RadioButton = RadioButton;
Form.SubmitButton = SubmitButton;
Form.Errors = FormErrors;
