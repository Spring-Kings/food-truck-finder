import React from "react";

import * as route from "../../../../api/RouteLocation";
import OwnerDashboardComponent from "../OwnerDashboardComponent";
import user_data from "../../../../util/test_util/user_data.json";
import { shallow } from "enzyme";
import {
  RouteLocation,
  RouteLocationState,
} from "../../../map/route-map/RouteLocation";

const MOCK_REQUEST = jest.fn();

const LOC: RouteLocation = {
  routeLocationId: 0,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: { lat: 0, lng: 0 },
  state: RouteLocationState.PERSISTED,
};

describe("Test owner dashboard", () => {
  /* Mock out route API */
  beforeAll(() => {
    jest.mock("../../../../api/RouteLocation", () => {
      loadTodaysRoute: MOCK_REQUEST;
    });
  });

  /* Clear the mock request, to ensure no cross-test contamination */
  afterEach(() => {
    MOCK_REQUEST.mockClear();
  });

  /* Snapshot */
  test("Matches snapshot", () => {
    MOCK_REQUEST.mockImplementationOnce(() => [LOC]);
    const component = shallow(
      <OwnerDashboardComponent
        data={user_data}
        loadUserFromBackend={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
