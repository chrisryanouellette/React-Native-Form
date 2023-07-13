import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithClient } from "@src/test/utils";

import { commonInputTests } from "../Input.tests";

import { CurrencyInput } from "./index";

commonInputTests("CurrencyInput", <CurrencyInput label="TEST" />);

test("Currency input calls onUpdate with a number", async () => {
  const onUpdateMock = jest.fn();
  renderWithClient(
    <CurrencyInput label="TEST" inputProps={{ onUpdate: onUpdateMock }} />,
  );

  fireEvent.changeText(screen.getByLabelText("TEST"), "1.00");
  expect(onUpdateMock.mock.calls.length).toBe(1);
  expect(onUpdateMock.mock.calls[0][0]).toBe(1);
});

test("Currency input calls onUpdate with NaN", async () => {
  const onUpdateMock = jest.fn();
  renderWithClient(
    <CurrencyInput label="TEST" inputProps={{ onUpdate: onUpdateMock }} />,
  );

  fireEvent.changeText(screen.getByLabelText("TEST"), "ABC");
  expect(onUpdateMock.mock.calls.length).toBe(1);
  expect(onUpdateMock.mock.calls[0][0]).toBe(NaN);
});
