import { FormFields, FormFieldsState, GenericFields } from "./useForm";

export type ReducerFn<K, R = FormFieldsState> = (
  state: R,
  action: Extract<FormFieldsActions, { action: K }>["value"],
) => R;

export const reducerActions = {
  register: "register",
  unregister: "unregister",
  set: "set",
  setMany: "setMany",
  setDefault: "setDefault",
  setDefaultMany: "setDefaultMany",
  setMetadata: "setMetadata",
  validate: "validate",
} as const;

type ReducerActions = typeof reducerActions;

type RegisterFieldAction = {
  action: ReducerActions["register"];
  value: {
    name: string;
    value: unknown;
    defaultValue?: unknown;
  };
};

function register(
  fields: FormFieldsState,
  action: RegisterFieldAction["value"],
): FormFieldsState {
  if (fields[action.name]) {
    /**
     * @TODO this can be hit when fields are set to persist
     * If the `persist` prop was not used then throw an error
     */
    return fields;
  }

  return {
    ...fields,
    [action.name]: {
      value: action.value,
      defaultValue: action.defaultValue ?? undefined,
      edited: false,
      errors: new Set<string>(),
    },
  };
}

type UnRegisterFieldAction = {
  action: ReducerActions["unregister"];
  value: {
    name: string;
  };
};

const unregister = (
  fields: FormFields<GenericFields>,
  action: UnRegisterFieldAction["value"],
): FormFields<GenericFields> => {
  if (!(action.name in fields)) {
    throw new Error(
      `Field "${action.name}" was unregistered but the fields does not exist.`,
    );
  }
  delete fields[action.name];
  return { ...fields };
};

type SetFieldAction = {
  action: ReducerActions["set"];
  value: {
    name: string;
    value: unknown;
  };
};

const set = (
  fields: FormFields<GenericFields>,
  action: SetFieldAction["value"],
): FormFields<GenericFields> => {
  const field = fields[action.name];

  if (!field) {
    throw new Error(
      `Field "${action.name}" was set but the field does not exist.`,
    );
  }

  field.value = action.value;
  field.edited = true;

  return {
    ...fields,
    [action.name]: field,
  };
};

type SetManyFieldAction = {
  action: ReducerActions["setMany"];
  value: Record<string, unknown>;
};

const setMany = (
  fields: FormFields<GenericFields>,
  action: SetManyFieldAction["value"],
): FormFields<GenericFields> => {
  for (const key of Object.keys(action)) {
    const field = fields[key];
    const value = action[key];

    if (!field) {
      throw new Error(
        `Field "${key}" was set via setManyValue but the field does not exist.`,
      );
    }

    field.value = value;
    field.edited = true;
  }

  return fields;
};

type SetDefaultFieldAction = {
  action: ReducerActions["setDefault"];
  value: {
    name: string;
    defaultValue: unknown;
  };
};

const setDefault = (
  fields: FormFields<GenericFields>,
  action: SetDefaultFieldAction["value"],
): FormFields<GenericFields> => {
  const field = fields[action.name];

  if (!field) {
    throw new Error(
      `Field "${action.name}" was set but the field does not exist.`,
    );
  }

  field.defaultValue = action.defaultValue;
  field.value = field.value ?? action.defaultValue;

  return {
    ...fields,
    [action.name]: field,
  };
};

type SetDefaultManyFieldAction = {
  action: ReducerActions["setDefaultMany"];
  value: Record<string, unknown>;
};

const setDefaultMany = (
  fields: FormFields<GenericFields>,
  action: SetDefaultManyFieldAction["value"],
): FormFields<GenericFields> => {
  for (const key of Object.keys(action)) {
    const field = fields[key];
    const defaultValue = action[key];

    if (!field) {
      throw new Error(
        `Field "${key}" was set via setDefaultMany but the field does not exist.`,
      );
    }

    field.defaultValue = defaultValue;
    field.value = field.value ?? defaultValue;
  }

  return fields;
};

type MetadataFieldAction = {
  action: ReducerActions["setMetadata"];
  value: {
    name: string;
    metadata: {
      defaultValue?: unknown;
      edited?: boolean;
      errors?: Set<string>;
    };
  };
};

const metadata = (
  fields: FormFields<GenericFields>,
  action: MetadataFieldAction["value"],
): FormFields<GenericFields> => {
  const field = fields[action.name];

  return {
    ...fields,
    [action.name]: {
      ...field,
      ...action.metadata,
    },
  };
};

type ValidateFieldAction = {
  action: ReducerActions["validate"];
  value: {
    name: string;
    errors: Set<string>;
  };
};

const validate = (
  fields: FormFields<GenericFields>,
  action: ValidateFieldAction["value"],
): FormFields<GenericFields> => {
  const field = fields[action.name];

  if (!field) {
    throw new Error(
      `Field "${action.name}" was set but the field does not exist.`,
    );
  }

  field.errors = action.errors;

  return {
    ...fields,
    [action.name]: field,
  };
};

export type FormFieldsActions =
  | RegisterFieldAction
  | UnRegisterFieldAction
  | SetFieldAction
  | SetManyFieldAction
  | SetDefaultFieldAction
  | SetDefaultManyFieldAction
  | MetadataFieldAction
  | ValidateFieldAction;

const reducers: {
  [K in keyof typeof reducerActions]: ReducerFn<K>;
} = {
  [reducerActions.register]: register,
  [reducerActions.unregister]: unregister,
  [reducerActions.set]: set,
  [reducerActions.setMany]: setMany,
  [reducerActions.setMetadata]: metadata,
  [reducerActions.setDefault]: setDefault,
  [reducerActions.setDefaultMany]: setDefaultMany,
  [reducerActions.validate]: validate,
};

export const reducer = <Fields extends GenericFields>(
  fields: FormFields<Fields>,
  action: FormFieldsActions,
): FormFields<Fields> => {
  if (action.action in reducers) {
    const reducerFn = reducers[action.action] as ReducerFn<
      typeof action.action,
      FormFields<Fields>
    >;
    return reducerFn(fields, action.value);
  }
  throw new Error(
    `Action "${action.action}" is not a valid form fields reducer action.`,
  );
};
