import * as RouteLocationApi from "../RouteLocation";

import mock_route from "./route/mock_backend_response.json";
import mock_route_locs from "./route/frontend_oracle.json";
import API_SUITE from "../../util/test_util/api_tests";

// Create oracle
const today = new Date(Date.now()).toISOString().split("T")[0];
let mock_result_data = mock_route_locs.map(mrl => ({
  ...mrl,
  arrivalTime: `${today}${mrl.arrivalTime}`,
  exitTime: `${today}${mrl.exitTime}`
}));

API_SUITE("Test Route Location API", [
  {
    testName: "loadTodaysRoute parses a route properly",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, fail),
    mockResponse: mock_route,
    actualResponse: mock_result_data
  },
  {
    testName: "loadTodaysRoute returns empty correctly",
    apiCall: async () => await RouteLocationApi.loadTodaysRoute(1, _err => {}),
    mockResponse: mock_route,
    actualResponse: [],
    fails: true
  }
]);
