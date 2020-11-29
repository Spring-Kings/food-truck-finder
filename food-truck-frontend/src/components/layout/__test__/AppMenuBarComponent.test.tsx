import React from "react";

import {AppMenuBarComponent} from "../AppMenuBarComponent";
import user_data from "../../../util/test_util/user_data.json";
import { SNAPSHOT_TEST } from "../../../util/test_util/basic_tests";

SNAPSHOT_TEST(
  "Snapshot test app menu bar",
  () => {
    jest.mock("../../notifications/NotificationWatcher", () => ({
        __esModule: true,
        default: <div />
    }));
  },
  () => {
      jest.unmock("../../notifications/NotificationWatcher");
  },
  () => (<AppMenuBarComponent data={user_data} logoutUser={jest.fn()} loadUserFromBackend={jest.fn()} />)
);