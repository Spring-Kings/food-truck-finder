import React from "react";
import { makeEmptyTruckState as mockMakeTruck } from "../../TruckView";

// Mock out retrieve trucks
jest.mock("../../../api/Truck", () => ({
  getTrucksForCurrentUser: jest.fn().mockResolvedValue([mockMakeTruck()]),
}));

import { SNAPSHOT_TEST } from "../../../util/test_util/basic_tests";
import ManageTrucksComponent from "../ManageTrucksComponent";

SNAPSHOT_TEST("Snapshot manage trucks component", () => {
  return (
    <ManageTrucksComponent/>
  );
});
