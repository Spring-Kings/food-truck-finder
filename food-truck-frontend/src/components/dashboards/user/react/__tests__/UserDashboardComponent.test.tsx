import React from "react";

jest.mock("../../../../../api/Truck", () => ({
  getNearbyTruckLocations: jest.fn().mockImplementation(() => [mockLOC]),
}));

import UserDashboardComponent from "../UserDashboardComponent";
import user_data from "../../../../../util/test_util/user_data.json";
import {
  RouteLocation,
  RouteLocationState,
} from "../../../../map/route-map/RouteLocation";
import { SNAPSHOT_TEST } from "../../../../../util/test_util/basic_tests";

const mockLOC: RouteLocation = {
  routeLocationId: 0,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: { lat: 0, lng: 0 },
  state: RouteLocationState.PERSISTED,
};

SNAPSHOT_TEST(
  "Snapshot test user dashboard",
  () => {
    return (<UserDashboardComponent data={user_data} loadUserFromBackend={() => {}} />);
  }
);