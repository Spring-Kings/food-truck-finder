import * as RouteLocationApi from "../RouteLocation";

import todaysRoute_response from "./route/todaysRoute_response.json";
import { FRONTEND_ORACLE, BACKEND_ORACLE, ORACLE_ROUTE_ID } from "./route/oracle";
import loadRouteLocations_response from "./route/loadRouteLocations_response.json";
import API_SUITE, { Mock, SUCCEED_POST } from "../../util/test_util/api_tests";
import api from "../../util/api";

API_SUITE("Test loadTodaysRoute", [
  {
    testName: "Parses a route properly",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, fail),
    mockResponse: todaysRoute_response,
    actualResponse: FRONTEND_ORACLE
  },
  {
    testName: "Returns empty on failure",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, _err => {}),
    mockResponse: todaysRoute_response,
    actualResponse: [],
    fails: true
  }
]);

API_SUITE("Test loadRouteLocations", [
  {
    testName: "Parses a route properly",
    apiCall: async () => await RouteLocationApi.loadRouteLocations(1, fail),
    mockResponse: loadRouteLocations_response,
    actualResponse: FRONTEND_ORACLE
  },
  {
    testName: "Returns empty correctly",
    apiCall: async () => await RouteLocationApi.loadRouteLocations(1, _err => {}),
    mockResponse: loadRouteLocations_response,
    actualResponse: [],
    fails: true
  }
]);

API_SUITE("Test updateRouteLocations", [
  {
    testName: "Attempt to save a route properly",
    apiCall: async (mock: Mock) => SUCCEED_POST(
      async () => await RouteLocationApi.updateRouteLocations(ORACLE_ROUTE_ID, FRONTEND_ORACLE, () => {}, fail),
      (newMock: Mock) => { api.request = newMock; },
      () => { api.request = mock; }
    ),
    mockResponse: loadRouteLocations_response,
    actualResponse: BACKEND_ORACLE
  }
]);

API_SUITE("Test deleteRouteLocations", [
  {
    testName: "Attempt to delete route locations properly",
    apiCall: async (mock: Mock) => {
      let result: any = undefined;
      api.request = jest.fn().mockImplementationOnce(input => {
        result = input.data;
        return Promise.resolve();
      })
      await RouteLocationApi.updateRouteLocations(ORACLE_ROUTE_ID, FRONTEND_ORACLE, () => {}, fail)
      api.request = mock;
      return result;
    },
    mockResponse: loadRouteLocations_response,
    actualResponse: BACKEND_ORACLE
  }
]);
