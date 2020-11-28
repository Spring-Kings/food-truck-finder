import * as RouteLocationApi from "../RouteLocation";

import todaysRoute_response from "./route/todaysRoute_response.json";
import oracle from "./route/oracle";
import loadRouteLocations_response from "./route/loadRouteLocations_response.json";
import API_SUITE from "../../util/test_util/api_tests";

API_SUITE("Test loadTodaysRoute", [
  {
    testName: "Parses a route properly",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, fail),
    mockResponse: todaysRoute_response,
    actualResponse: oracle
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
    actualResponse: oracle
  },
  {
    testName: "Returns empty correctly",
    apiCall: async () => await RouteLocationApi.loadRouteLocations(1, _err => {}),
    mockResponse: loadRouteLocations_response,
    actualResponse: [],
    fails: true
  }
]);
