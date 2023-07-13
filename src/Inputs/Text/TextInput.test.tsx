import React from "react";

import { commonInputTests } from "../Input.tests";

import { TextInput } from "./index";

commonInputTests("TextInput", <TextInput label="TEST" />);
