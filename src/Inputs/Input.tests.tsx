/*
This file is named "tests" for it does not get picked up by Jest
Jest will fail if there is a file called `.test` but does not have
any tests within the file.
Since this file exports test utilities it is related to testing
but will not include any tests.
*/
import { ReactElement, cloneElement } from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithClient } from "@src/test/utils";

export function commonInputTests(name: string, component: ReactElement) {
  describe(`Common input tests for "${name}"`, () => {
    test("Text input calls onUpdate", async () => {
      const onUpdateMock = jest.fn();
      renderWithClient(
        cloneElement(component, {
          label: "TEST",
          inputProps: { onUpdate: onUpdateMock },
        }),
      );

      fireEvent.changeText(screen.getByLabelText("TEST"), "TEST");
      expect(onUpdateMock.mock.calls.length).toBe(1);
    });

    test("Text input displays label", () => {
      renderWithClient(
        cloneElement(component, {
          label: "TEST",
        }),
      );

      expect(screen.getByText("TEST")).toBeTruthy();
    });

    test("Text input displays errors", () => {
      renderWithClient(
        cloneElement(component, {
          label: "TEST",
          errorProps: { errors: ["ERROR"] },
        }),
      );

      expect(screen.getByText("ERROR")).toBeTruthy();
    });
  });
}
