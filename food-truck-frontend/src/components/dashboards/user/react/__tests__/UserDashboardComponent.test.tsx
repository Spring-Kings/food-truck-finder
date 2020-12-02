import React from "react";
import mockSimpleTrucks from "../../../../../util/test_util/mock_simple_trucks.json";

jest.mock("../../../../../api/TruckApi", () => ({
  getNearbyTruckLocations: jest.fn().mockImplementation(() => [mockLOC]),
}));
jest.mock("../../../../../util/position", () => ({
  getLocationFromStorage: jest.fn().mockReturnValue({ lat: 0, lng: 0 })
}));
jest.mock("../../../../../util/api", () => ({
  request: jest.fn().mockReturnValue({ data: mockSimpleTrucks })
}))

import UserDashboardComponent from "../UserDashboardComponent";
import user_data from "../../../../../util/test_util/user_data.json";
import { RouteLocation } from "../../../../../domain/RouteLocation";
import { shallow } from "enzyme";

const mockLOC: RouteLocation = {
  routeLocationId: 0,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: { lat: 0, lng: 0 },
  state: "PERSISTED" as "PERSISTED",
};

var oldLocalStorage: Storage;

describe("Snapshot test user dashboard", () => {
    beforeAll(() => {
      oldLocalStorage = global.localStorage;
      global.localStorage = {
        getItem: jest.fn().mockReturnValue("[ 7, 11 ]")
      } as unknown as Storage;
    });
    afterAll(() => global.localStorage = oldLocalStorage);
    test("Matches snapshot", () => {
      const shallowRender = shallow(<UserDashboardComponent data={user_data} loadUserFromBackend={() => {}} />);
      expect(shallowRender.html()).toMatchSnapshot();
    })
  }
);