# Checkbox - `<Form.Checkbox />`

An pre-composed component that allows the user mark a field as checked or unchecked.

![Checkbox Example](./images/checkbox.webp)
![Checkbox Example Checked](./images/checkbox_checked.webp)
![Checkbox Example Disabled](./images/checkbox_disabled.webp)

## Getting Started

This input only requires the `label` prop but the label can be hidden with the `hideLabel` prop.

```tsx
return (
  <Form>
    <Form.Item name="setAsDefault">
      <Form.Checkbox label="Set as default shipping address" />
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

- **id** ( Optional ): `string`<br />

- **disabled** ( Optional ): `boolean`<br />
  Does not allow the checkbox to change it's state. A style is applied to indicate that the checkbox is disabled.

- **containerProps** ( Optional ): `ViewProps`<br />
  Props passed to the wrapping `<View>` component. This component wraps the label, input, and error components.

- **inputContainerProps** ( Optional ): `ViewProps`<br />
  Props passed to to the `<View>` component wrapping the input components.

- **inputProps** ( Optional ): `TextInputProps & { defaultValue?: unknown }`<br />
  Props passed to the `<Input>` component.

- **errorProps** ( Optional ): `ErrorProps`<br />
  Props passed to the `<Error>` component.
