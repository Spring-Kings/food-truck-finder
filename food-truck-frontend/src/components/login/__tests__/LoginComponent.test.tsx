import React from "react";
import user_data from "../../../util/test_util/user_data.json";
import { SNAPSHOT_TEST } from "../../../util/test_util/basic_tests";
import LoginComponent from "../LoginComponent";

jest.mock("../../../util/api");

SNAPSHOT_TEST(
  "Snapshot test login component",
  () => {
    return (<LoginComponent data={user_data} loadUserFromBackend={() => Promise.resolve()} />);
  }
);