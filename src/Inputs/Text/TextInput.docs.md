# Text Input - `<Form.TextInput />`

An pre-composed component that allows the user to enter text into a field.

![Example Text Input](./images/text_input.webp)
![Example Error State](./images/text_input_error.webp)

## Getting Started

Most inputs only require a `label` prop but the label can be hidden with the `hideLabel` prop.

```tsx
return (
  <Form>
    <Form.Item name="firstName">
      <Form.TextInput label="First Name" />
    </Form.Item>
  </Form>
);
```

## API

### Values

- **label** ( Required ): `string`<br />
  The label displayed above the input. Can be hidden with the `hideLabel` prop.

- **hideLabel** ( Optional ): `boolean`<br />
  Hides the label from the UI but, the label is still used to describe the input for accessability.

- **helperText** ( Optional ): `string`<br />
  Text below the label to add additional context to the input or restrictions for the input.

- **labelProps** ( Optional ): `LabelProps`<br />
  Props passed to the `<Label>` component.

- **state** ( Optional ): `InputState`<br />
  The state the input is in. Either "disabled" | "error".

- **containerProps** ( Optional ): `ViewProps`<br />
  Props passed to the wrapping `<View>` component. This component wraps the label, input, and error components.

- **inputContainerProps** ( Optional ): `ViewProps`<br />
  Props passed to to the `<View>` component wrapping the input components.

- **inputProps** ( Optional ): `TextInputProps & { defaultValue?: unknown }`<br />
  Props passed to the `<Input>` component.

- **errorProps** ( Optional ): `ErrorProps`<br />
  Props passed to the `<Error>` component.
