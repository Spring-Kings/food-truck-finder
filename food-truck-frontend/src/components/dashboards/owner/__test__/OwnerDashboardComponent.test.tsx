import React from "react";

import * as route from "../../../../api/RouteLocation";
import OwnerDashboardComponent from "../OwnerDashboardComponent";
import user_data from "../../../../util/test_util/user_data.json";
import { shallow } from "enzyme";
import {
  RouteLocation,
  RouteLocationState,
} from "../../../map/route-map/RouteLocation";
import { SNAPSHOT_TEST } from "../../../../util/test_util/basic_tests";

const mockLOC: RouteLocation = {
  routeLocationId: 0,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: { lat: 0, lng: 0 },
  state: RouteLocationState.PERSISTED,
};

SNAPSHOT_TEST(
  "Test owner dashboard",
  () => {
    jest.mock("../../../../api/RouteLocation", () => ({
      loadTodaysRoute: jest.fn().mockImplementation(() => [mockLOC]),
    }));
  },
  () => jest.unmock("../../../../api/RouteLocation"),
  () => (
    <OwnerDashboardComponent data={user_data} loadUserFromBackend={() => {}} />
  )
);
