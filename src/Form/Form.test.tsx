import React from "react";
import { renderWithClient } from "@src/test/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { Form, FormField, ValidationAddError } from "./index";

const handleFinishMock = jest.fn();
const handleFinishFailedMock = jest.fn();
const validationMock = jest.fn(
  (name, field: FormField<string>, addError: ValidationAddError) => {
    if (field.value === "ERROR") {
      addError("Test Error");
    }
  },
);
beforeEach(() => {
  handleFinishMock.mockClear();
  handleFinishFailedMock.mockClear();
  validationMock.mockClear();
});

test("Form submits with correct values", async () => {
  renderWithClient(
    <Form onFinish={handleFinishMock}>
      <Form.Item name="firstName">
        <Form.TextInput label="First Name" />
      </Form.Item>
      <Form.SubmitButton>Submit</Form.SubmitButton>
    </Form>,
  );

  fireEvent.changeText(screen.getByLabelText("First Name"), "TEST");
  fireEvent.press(screen.getByText("Submit"));

  await waitFor(() => !!handleFinishMock.mock.calls.length);
  expect(handleFinishMock.mock.calls.length).toBe(1);
  expect(handleFinishMock.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "firstName": Object {
          "defaultValue": undefined,
          "edited": true,
          "errors": Set {},
          "value": "TEST",
        },
      },
      [Function],
    ]
  `);
});

test("Form fails with correct values", async () => {
  renderWithClient(
    <Form onFinishFailed={handleFinishFailedMock}>
      <Form.Item name="firstName" validation={validationMock}>
        <Form.TextInput label="First Name" />
      </Form.Item>
      <Form.SubmitButton>Submit</Form.SubmitButton>
    </Form>,
  );

  fireEvent.changeText(screen.getByLabelText("First Name"), "ERROR");
  fireEvent.press(screen.getByText("Submit"));

  await waitFor(() => !!handleFinishFailedMock.mock.calls.length);
  expect(validationMock.mock.calls.length).toBe(1);
  expect(handleFinishFailedMock.mock.calls.length).toBe(1);
  expect(handleFinishFailedMock.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Array [
        "firstName",
      ],
      Object {
        "firstName": Object {
          "defaultValue": undefined,
          "edited": true,
          "errors": Set {
            "Test Error",
          },
          "value": "ERROR",
        },
      },
    ]
  `);
});

test("Form can fail, then be fixed, and submit correctly", async () => {
  renderWithClient(
    <Form onFinish={handleFinishMock} onFinishFailed={handleFinishFailedMock}>
      <Form.Item name="firstName" validation={validationMock}>
        <Form.TextInput label="First Name" />
      </Form.Item>
      <Form.SubmitButton>Submit</Form.SubmitButton>
    </Form>,
  );

  fireEvent.changeText(screen.getByLabelText("First Name"), "ERROR");
  fireEvent.press(screen.getByText("Submit"));

  await waitFor(() => !!handleFinishFailedMock.mock.calls.length);
  expect(validationMock.mock.calls.length).toBe(1);
  expect(handleFinishFailedMock.mock.calls.length).toBe(1);

  fireEvent.changeText(screen.getByLabelText("First Name"), "TEST");
  fireEvent.press(screen.getByText("Submit"));

  await waitFor(() => !!handleFinishMock.mock.calls.length);
  expect(handleFinishMock.mock.calls.length).toBe(1);
});
