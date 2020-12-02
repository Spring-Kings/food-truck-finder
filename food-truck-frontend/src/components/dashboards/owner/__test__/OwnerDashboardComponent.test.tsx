import React from "react";

import OwnerDashboardComponent from "../OwnerDashboardComponent";
import user_data from "../../../../util/test_util/user_data.json";
import {
  RouteLocation
} from "../../../../domain/RouteLocation";
import { SNAPSHOT_TEST } from "../../../../util/test_util/basic_tests";

const mockLOC: RouteLocation = {
  routeLocationId: 0,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: { lat: 0, lng: 0 },
  state: "PERSISTED" as "PERSISTED",
};

jest.mock("../../../../api/RouteLocationApi", () => ({
  loadCurrentRoute: jest.fn().mockImplementation(() => [mockLOC]),
}));

SNAPSHOT_TEST(
  "Test owner dashboard",
  () => (
    <OwnerDashboardComponent data={user_data} loadUserFromBackend={() => {}} />
  )
);
