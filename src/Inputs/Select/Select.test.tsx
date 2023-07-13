import React from "react";
import { renderWithClient } from "@src/test/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { SelectInput } from "./Composed";
import { SelectItem } from "./SelectItem";
import { SelectModalHeader } from "./ModalHeader";

const VALUE = "TEST_VALUE";
const VALUE_TWO = "TEST_VALUE_TWO";

it("Select input can be opened", () => {
  renderWithClient(
    <SelectInput label="TEST">
      <SelectItem value={VALUE}>{VALUE}</SelectItem>
    </SelectInput>,
  );

  fireEvent.press(screen.getByRole("combobox"));
  expect(screen.getByText(VALUE)).toBeVisible();
});

it("Select input can have a default value", () => {
  renderWithClient(
    <SelectInput label="TEST" inputProps={{ defaultValue: VALUE }}>
      <SelectItem value={VALUE}>{VALUE}</SelectItem>
    </SelectInput>,
  );

  expect(screen.getByRole("combobox")).toHaveTextContent(VALUE);
});

it("Select input can have a value selected", () => {
  renderWithClient(
    <SelectInput label="TEST">
      <SelectItem value={VALUE}>{VALUE}</SelectItem>
    </SelectInput>,
  );

  fireEvent.press(screen.getByRole("combobox"));
  fireEvent.press(screen.getByRole("togglebutton"));

  expect(screen.getByRole("combobox")).toHaveTextContent(VALUE);
});

it("Select input can be closed via the <SelectModalHeader>", async () => {
  const testID = "select-modal";
  renderWithClient(
    <SelectInput label="TEST" inputProps={{ modalProps: { testID } }}>
      <SelectModalHeader title="HEADER" />
      <SelectItem value={VALUE}>{VALUE}</SelectItem>
    </SelectInput>,
  );

  fireEvent.press(screen.getByRole("combobox"));
  fireEvent.press(screen.getByRole("button"));

  await waitFor(() =>
    expect(screen.getByTestId(testID)).toHaveProp("visible", false),
  );
});

it("Select input can have multiple values", () => {
  renderWithClient(
    <SelectInput multi label="TEST">
      <SelectModalHeader title="HEADER" />
      <SelectItem value={VALUE}>{VALUE}</SelectItem>
      <SelectItem value={VALUE_TWO}>{VALUE_TWO}</SelectItem>
    </SelectInput>,
  );

  fireEvent.press(screen.getByRole("combobox"));
  fireEvent.press(screen.getByRole("togglebutton", { name: VALUE }));
  fireEvent.press(screen.getByRole("togglebutton", { name: VALUE_TWO }));
  fireEvent.press(screen.getByRole("button"));

  expect(screen.getByRole("combobox")).toHaveTextContent(
    `${VALUE}, ${VALUE_TWO}`,
  );
});
