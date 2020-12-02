import React from "react";

import {AppMenuBarComponent} from "../AppMenuBarComponent";
import user_data from "../../../util/test_util/user_data.json";
import { SNAPSHOT_TEST } from "../../../util/test_util/basic_tests";
import { Provider } from "react-redux";
import mock_store from "../../../util/test_util/mock_store";

// Learned from: https://github.com/reduxjs/redux-mock-store
// I had a vague memory it existed from way back in the wayback machine
const mockStore = mock_store();

SNAPSHOT_TEST(
  "Snapshot test app menu bar",
  () => (
    <Provider store={mockStore}>
      <AppMenuBarComponent data={user_data} logoutUser={jest.fn()} loadUserFromBackend={jest.fn()} />
    </Provider>)
);