# Form Hooks - WIP

This document describes the hooks exposed by the form. The hooks are used to add functionality to the form, set default values, and add callbacks to events within the form's lifecycle.

List of hooks

- `useForm`: An interface between the developer and the form's and form field's state.
- `useErrors`: Creates state for a particular form field's errors.
- `useFormField`: Creates state for a particular form field.
- `useFormFieldValue`: Creates state for a form field's value.
- `useFormFinishedValue`: Creates state for a form field's value that is only updated when the form is submitted.

# `Form.useForm`

A interface for the developer to directly interact with and edit the form's and form field's state. The most common use case is to set the default values for a form after receiving some data from the back end.

## Setup - `Form.useForm`

```tsx
const form = Form.useForm();

return <Form form={form}></Form>;
```

**NOTE**, it is important that the `form` variable is passed to the `<Form>` component. If it is not then all the changes done via the variable will have no effect on the form.

## Setting a field's value - `Form.useForm`

The following example uses TranStack's `useQuery` hook to set the default values for a form.

```tsx
const form = Form.useForm();
const query = useQuery({
  queryKey: ["name"],
  queryFn: queryFn,
});

useEffect(
  function handleSetFormInitialValues() {
    if (query.data) {
      form.setMany({
        firstName: query.data.firstName,
      });
    }
  },
  [query.data, form],
);

return (
  <Form form={form}>
    <Form.Item name="firstName">
      <Form.TextInput label="First Name" />
    </Form.Item>
  </Form>
);
```

**NOTE**, the `set` and `setMany` form methods will only change the field's value once. Once a value has been provided for the form field's then the value will remain even if the one of the methods is called again.

## Getting a field's value - `Form.useForm`

```tsx
const form = Form.useForm();

function handlePress(): void {
  const firstName = form.fields.get().firstName.value;

  // Or

  const fields = form.fields.get();
  const firstName = fields.firstName.value;
}
```

## Submitting the form - `Form.useForm`

The form can be submitted without the use of the `<Form.SubmitButton>` if needed. We should not `await` the `submit` function because it will never throw even if the form's validation failed. Instead the form's `onFinish` and `onFinishFailed` props should be used.

```tsx
function handlePress(): void {
  form.submit();
}
```

## FAQ - `Form.useForm`

- When do I use the `useForm` hook?<br />
  Anytime you need to manipulate the form or interact with a form's event. The most common manipulations are setting the form's field values based on data fetched from the back end. The most common interaction is submitting the form based on some user action.

- Why is nothing happening when I use the hook?<br />
  Make sure you passed the `form` variable to the `<Form>` component like so `<Form form={form}>`

## API

### Values

- **fields**: `ReadOnlyUseCreateStore<FormFields<GenericFields>>`<br />
  The form fields within a read only store. See "Getting a field's value - `Form.useForm`" above for an example on how to get a field's value

- **state**: `ReadOnlyUseCreateStore<FormState>`<br />
  The current state of the form including the current status and any errors.

### Methods

- **register**: `(name: string, defaultValue: unknown) => () => void`<br />
  Creates a new object in the form's state with the given name. The returned function will remove the field from the form's state.

- **set**: `(name: string, value: unknown) => void`<br />
  Set's a field's default value and the value IF the value is `null` ( default ). This will cause the input to show the set value. The field will not be marked as edited.

- **setMany**: `(obj: {[key: string]: unknown}) => void`<br />
  Set's multiple field's default values like the `set` method above. This method follows the same rules as `set`.

- **setValue**: `(name: string, value: unknown) => void`<br />
  Will set the field's value but will NOT display the value in the input. If you want the input to display the value being set, use the `set` method described above. This also marks the field as edited.

- **setManyValue**: `(obj: {[key: string]: unknown}) => void`<br />
  Set's multiple field's values like the `setValue` method above. This method follows the same rules as `setValue`.

- **setMetadata**: `(name: string, metadata: {defaultValue?: string, edited?: boolean, errors?: Set<string>}) => void`<br />
  Set's a fields data attributes. This can be useful when programmatically setting a field's edited state back to false.

- **validation**: `(name: string, fn: Validation) => () => void`<br />
  Adds a validation function to a form field which will be ran on submission. The returned function will remove the validation function so it will no longer be ran during submission.

- **validate**: `(name: string) => Promise<string | void>`<br />
  Runs the validation functions for a field. If any of the validation functions failed, a string with the field's name will be returned from the promise.

- **submit**: `() => void`<br />
  Submits the form, runs the validation, and will call `onFinish` or `onFinishFailed` depending on if the validation was successful.

- **setFormError**: `(errors: string | string[]) => void`<br />
  Sets the errors for the entire form. This will update the `<Form.Errors>` component.

- **subscribe**: `(event: string, fn: (args) => void)`<br />
  Will run the callback provided when an event occurs. The arguments for the function depend on which event being subscribed to.
