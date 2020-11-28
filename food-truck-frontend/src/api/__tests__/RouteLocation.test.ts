import * as RouteLocationApi from "../RouteLocation";

import mock_route from "./route/mock_backend_response.json";
import mock_route_locs from "./route/frontend_oracle.json";
import API_SUITE from "../../util/test_util/api_tests";

API_SUITE("Test Route Location API", [
  {
    testName: "loadTodaysRoute parses a route properly",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, fail),
    mockResponse: mock_route,
    actualResponse: mock_route_locs
  },
  {
    testName: "loadTodaysRoute returns empty correctly",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, _err => {}),
    mockResponse: mock_route,
    actualResponse: [],
    fails: true
  }
]);
