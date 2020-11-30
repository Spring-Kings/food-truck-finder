import React from "react";

import OwnerDashboardComponent from "../OwnerDashboardComponent";
import user_data from "../../../../util/test_util/user_data.json";
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

jest.mock("../../../../api/RouteLocation", () => ({
  loadTodaysRoute: jest.fn().mockImplementation(() => [mockLOC]),
}));

SNAPSHOT_TEST(
  "Test owner dashboard",
  () => (
    <OwnerDashboardComponent data={user_data} loadUserFromBackend={() => {}} />
  )
);
