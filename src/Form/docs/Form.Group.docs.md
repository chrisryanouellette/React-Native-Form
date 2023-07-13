# Form Groups - `<Form.Group>` - WIP


### Grouping Form Items

There maybe instances where we want to map over a list of data and then add inputs for each element in the array. For example, if we had a list of users and wanted to add a first and last name field for each of them.

```tsx
type FormWithGroup = {
  users: FormGroup<{
    firstName: string;
    lastName: string;
  }>
}

const users = ["123", "312"];

return (
  <Form onFinish={handleSubmit}>
    <Form.Item name="users">
      {user.map((id) => (
        <Form.Group key={id} id={id}>
          <Form.Item name="firstName">
            <Form.TextInput label="First name" />
          </Form.Item>
          <Form.Item name="lastName">
            <Form.TextInput label="Last name" />
          </Form.Item>
        </From.Group>
      ))}
    </Form.Item>
    <Form.SubmitButton>Update</Form.SubmitButton>
  </Form>
);
```

We can then access this data with the ids we passed as the `id` prop to the from group.

```ts
function handleFinish(fields: FormFields<FormWithGroup>): void {
  const key = users[0];
  const firstUserFirstName = fields.users.value[key].firstName.value;
}
```

### Values

- **id**: `string`<br />
  The string used to index the group within the form state. If left blank, a random value is used.

- **children** ( Optional ): `ReactNode`<br />
  The form items to be rendered. They do not need to be direct descendants.
