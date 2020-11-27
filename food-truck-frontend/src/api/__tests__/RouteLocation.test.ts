import * as RouteLocationApi from "../RouteLocation";

import mock_route from "./mock_backend_response.json";
import mock_route_locs from "./frontend_oracle.json";
import API_SUITE from "../../util/test_util/api_tests";

API_SUITE("Test Route Location API", [
  {
    testName: "loadTodaysRoute parses a route properly",
    apiCall: async () => {
      const x = await RouteLocationApi.loadTodaysRoute(1, fail);
      console.log(JSON.stringify(x));
      return x;
    },
    mockResponse: mock_route,
    actualResponse: mock_route_locs
  }
]);
