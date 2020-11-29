import React from "react";

import {AppMenuBarComponent} from "../AppMenuBarComponent";
import user_data from "../../../util/test_util/user_data.json";
import { SNAPSHOT_TEST } from "../../../util/test_util/basic_tests";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

// Exactly what it says on the tin: a mock store state
const MOCK_STORE_STATE = {
  theme: {
    data: true
  },
  notifications: {
    data: {}
  }
};

// Learned from: https://github.com/reduxjs/redux-mock-store
// I had a vague memory it existed from way back in the wayback machine
const mockStore = configureMockStore([thunk])(MOCK_STORE_STATE);

SNAPSHOT_TEST(
  "Snapshot test app menu bar",
  () => (
    <Provider store={mockStore}>
      <AppMenuBarComponent data={user_data} logoutUser={jest.fn()} loadUserFromBackend={jest.fn()} />
    </Provider>)
);