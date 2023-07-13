# Form - `<Form>`

[Quick link](./?path=/docs/components-form-hooks--docs#useform) to the `useForm` docs.

## Getting Started

We will start with the `<Form>` component as the main wrapper for form inputs. The `<Form>` component handles the submission and other lifecycle methods that the user may invoke within the form.

Here is a standard from setup,

```tsx
<Form onFinish={handleFinish}>
</Form>
```

Before we define `handleSubmit` let's add a `<Form.Item>` component and an input. We will cover them both in more detail later.

```tsx
<Form onFinish={handleFinish}>
  <Form.Item name="firstName">
    <Form.TextInput label="First Name" />
  </Form.Item>
</Form>
```

The `onFinish` prop is our submission callback with some extra features. It will only be called if the form passed validation. More in that later as well!

Let's define the `handleFinish` function and see what arguments we get.

```ts
function handleFinish(fields: FormFields<{firstName: string}>): void {
  console.log(fields.firstName.value);
}
```

Finally, we can add a `<Form.SubmitButton>` to the component and we should see our `console.log`.

```tsx
<Form onFinish={handleFinish}>
  <Form.Item name="firstName">
    <Form.TextInput label="First Name" />
  </Form.Item>
  <Form.SubmitButton>Submit</Form.SubmitButton>
</Form>
```

That is a functioning form! Let's clean up a few more things with this final full example.

```tsx
import React from 'react';
import { Form } from '@Components/common/Form';

// We move the form's type up here because we may use it a lot
type MyForm = {
  firstName: string;
}

export function MyApp(): JSX.Element {

  function handleFinish(fields: FormFields<MyForm>): void {
    console.log(fields.firstName.value);
  }

  return (
    <Form onFinish={handleFinish}>
      <Form.Item name="firstName">
        <Form.TextInput label="First Name" />
      </Form.Item>
      <Form.SubmitButton>Submit</Form.SubmitButton>
    </Form>
  )
}
```

The next step to working with forms is understanding `<Form.Item>`. [Click here](./?path=/docs/components-form-form-item--docs#getting-started) to get started!

## API - `<Form>`

### Values

- **form** ( Optional ): `FormFields<any>`<br />
  An instance of a form's state and methods. Used when creating a controlled form. See the [`useForm` docs](./?path=/docs/components-form-hooks--docs#useform) for more info.

- **children** ( Optional ): `ReactNode`<br/>
  Child components to render within the form context. This can contain any number of components. `<Form.Item>`s can be any number of children deep.

## Methods

- **onUpdate** ( Optional ): `(name: string, value: unknown, form: FormFields<any> ) => void`<br/>
  Callback function that runs each time a field is changed.

- **onFinish** ( Required ): `(fields: FormFields<any>, addError: ValidationAddError) => void`<br />
  Callback function that is ran on submit once all the validation functions have ran without setting any errors.<br />
  If this function adds an error it will trigger the `<Form.Errors>` component to display.

- **onFinishFailed** ( Optional ): `(names: string[], fields: FormFields<any>) => void`<br />
  Callback function that is ran on submit if any of the fields set an error.

## A deeper dive