import React from "react";
import {FRONTEND_ORACLE as mockTrucks} from "../../../../util/test_util/route/oracle";

import * as route from "../../../../api/RouteLocation";
import RouteMap from "../RouteMap";
import { shallow } from "enzyme";

// Mock out retrieve trucks
jest.mock("../../../../api/RouteLocation", () => ({
  loadRouteLocations: jest.fn(),
  loadRouteIsActive: jest.fn()
}));

// Cache for original navigator
var originalNavigator: Navigator;

describe("Snapshot test route map component", () => {
  beforeAll(() => {
    originalNavigator = global.navigator;

    // Learned from: https://www.grzegorowski.com/how-to-mock-global-window-with-jest
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn().mockImplementation(c => c({ coords: { latitude: 0, longitude: 0 } })),
        clearWatch: jest.fn(),
        watchPosition: jest.fn()
      }
    } as any as Navigator;
  });

  afterAll(() => {
    global.navigator = originalNavigator;
  });

  test("Matches OK snapshot", () => {
    // Set up test data
    (route.loadRouteLocations as any as jest.Mock<any, any>).mockResolvedValueOnce(mockTrucks);
    (route.loadRouteIsActive as any as jest.Mock<any, any>).mockResolvedValueOnce(false);

    // Test
    const shallowRender = shallow(<RouteMap routeId={0}/>);
    expect(shallowRender.html()).toMatchSnapshot();
  })

  test("Matches route active snapshot", () => {
    // Set up test data
    (route.loadRouteLocations as any as jest.Mock<any, any>).mockResolvedValueOnce(mockTrucks);
    (route.loadRouteIsActive as any as jest.Mock<any, any>).mockResolvedValueOnce(true);

    // Test
    const shallowRender = shallow(<RouteMap routeId={0}/>);
    expect(shallowRender.html()).toMatchSnapshot();
  })

  test("Matches empty locations snapshot", () => {
    // Set up test data
    (route.loadRouteLocations as any as jest.Mock<any, any>).mockResolvedValueOnce([]);
    (route.loadRouteIsActive as any as jest.Mock<any, any>).mockResolvedValueOnce(false);

    // Test
    const shallowRender = shallow(<RouteMap routeId={0}/>);
    expect(shallowRender.html()).toMatchSnapshot();
  })
});
