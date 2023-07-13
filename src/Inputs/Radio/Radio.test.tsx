import React from "react";
import { renderWithClient } from "@src/test/utils";
import { fireEvent, screen } from "@testing-library/react-native";

import { RadioGroup } from "./Group";
import { RadioButton } from "./Radio";

const VALUE = "TEST_VALUE";
const VALUE_TWO = "TEST_VALUE_TWO";

it("Radio input can have a value selected", () => {
  const testID = "radio-test";
  renderWithClient(
    <RadioGroup label="TEST">
      <RadioButton inputProps={{ testID }} value={VALUE} label={VALUE} />
    </RadioGroup>,
  );

  fireEvent.press(screen.getByLabelText(`${VALUE} - 1 of 1`));
  expect(screen.getByTestId(testID)).toBeVisible();
});

it("Radio input can toggle between values", () => {
  const testIDOne = "radio-test-one";
  const testIDTwo = "radio-test-two";
  renderWithClient(
    <RadioGroup label="TEST">
      <RadioButton
        inputProps={{ testID: testIDOne }}
        value={VALUE}
        label={VALUE}
      />
      <RadioButton
        inputProps={{ testID: testIDTwo }}
        value={VALUE_TWO}
        label={VALUE_TWO}
      />
    </RadioGroup>,
  );

  fireEvent.press(screen.getByLabelText(`${VALUE} - 1 of 2`));
  expect(screen.getByTestId(testIDOne)).toBeVisible();
  fireEvent.press(screen.getByLabelText(`${VALUE_TWO} - 2 of 2`));
  expect(screen.getByTestId(testIDTwo)).toBeVisible();
});
