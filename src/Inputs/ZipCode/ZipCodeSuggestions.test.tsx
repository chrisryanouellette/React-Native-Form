import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { renderWithClient } from "@src/test/utils";
import { argoURL } from "@src/domain/argoURL";
import { StateAndCitySuggestion } from "@models/StateAndCitySuggestion";

import { ZipCodeSuggestions } from "./Suggestions";

import { ZipCodeInput } from "./index";

const responses: { [index: string]: StateAndCitySuggestion[] } = {
  "00000": [],
  "11111": [{ state: "STATE", city: "CITY", zipCode: "11111", stateId: 0 }],
};

const worker = setupServer(
  rest.get(`${argoURL}/zipcodeverification`, (req, res, ctx) => {
    const zipCode = req.url.searchParams.get("zipcode");

    if (!zipCode || !responses[zipCode]) {
      return res(
        ctx.status(500),
        ctx.json({
          errorMessage: "No zip code provided",
        }),
      );
    }

    return res(ctx.json(responses[zipCode]));
  }),
);

beforeAll(() => {
  worker.listen();
});

afterAll(() => {
  worker.close();
});

it("Zip code suggestions can load suggestions", async () => {
  renderWithClient(
    <ZipCodeInput label="TEST">
      <ZipCodeSuggestions />
    </ZipCodeInput>,
  );

  fireEvent.changeText(screen.getByLabelText("TEST"), "11111");

  await waitFor(() => expect(screen.getByRole("radio")).toBeVisible());
});

it("Zip code suggestions will show no available suggestions", async () => {
  renderWithClient(
    <ZipCodeInput label="TEST">
      <ZipCodeSuggestions />
    </ZipCodeInput>,
  );

  fireEvent.changeText(screen.getByLabelText("TEST"), "00000");

  await waitFor(() =>
    expect(
      screen.getByText(/Oops! No zip code suggestions available/i),
    ).toBeVisible(),
  );
});

it("Zip code suggestions will show an error if the request fails", async () => {
  renderWithClient(
    <ZipCodeInput label="TEST">
      <ZipCodeSuggestions />
    </ZipCodeInput>,
  );

  fireEvent.changeText(screen.getByLabelText("TEST"), "BAD_REQUEST");

  await waitFor(() =>
    expect(
      screen.getByText(/Could not load zip code suggestions/i),
    ).toBeVisible(),
  );
});

it("Zip code suggestions will give the correct args on change", async () => {
  const handleOnChange = jest.fn();

  renderWithClient(
    <ZipCodeInput label="TEST">
      <ZipCodeSuggestions onChange={handleOnChange} />
    </ZipCodeInput>,
  );

  fireEvent.changeText(screen.getByLabelText("TEST"), "11111");

  await waitFor(() => expect(screen.getByRole("radio")).toBeVisible());
  fireEvent.press(screen.getByRole("radio"));
  expect(handleOnChange.mock.calls.length).toBe(1);
  expect(handleOnChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "city": "CITY",
        "state": "STATE",
        "stateId": 0,
        "zipCode": "11111",
      },
    ]
  `);
});
