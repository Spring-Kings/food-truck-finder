import api from "../../util/api";
import { RouteLocation } from "../../components/map/route-map/RouteLocation";
import * as RouteLocationApi from "../RouteLocation";

import mock_route from "./mock_backend_response.json";
import mock_route_locs from "./frontend_oracle.json";

/**
 * This says 'this whole module is now a mock'. That lets us supply custom return values,
 * instead of running actual API calls
 */
jest.mock("../../util/api");

/**
 * jest.fn() creates a mock function. These are super helpful, since we can specify implementations for them on-
 * the-fly and ask them about calls that were done with them later
 */
var MOCK_REQUEST = jest.fn();

/**
 * Top level of Jest testing: describe. Wraps a bunch of tests together under a header describing what's being done.
 * Think of it like the test class you write for JUnit, though you can have multiple in a file.
 */
describe("Ensure RouteLocation endpoints work", () => {
  // like @BeforeAll in JUnit. This tells Jest to run the lambda before all tests run.
  beforeAll(() => {
    // We've now overwritten axios's request function with a mock. This lets us modify its behavior later
    api.request = MOCK_REQUEST;
  });

  // You'll need a Ph.D to guess what the JUnit equivalent of this is... :P
  // This runs the provided lambda after each test case.
  afterEach(() => {
    // For every mock function/object you create, make sure you clear it here. Otherwise, one test can
    // impact another in unexpected ways.
    MOCK_REQUEST.mockClear();
  });

  /**
   * Next level after `describe`: a single test case. Basically, one of the methods in your test class.
   * Again, comes with a short text description of what's being tested
   */
  test("loadTodaysRoute parses a route properly", async () => {
    // Mock Axios's return to return our premade data
    MOCK_REQUEST.mockImplementationOnce(() =>
      Promise.resolve({ data: mock_route })
    );

    // Make our request. I'm passing Jest's fail method as our onFail; this will cause the test to fail should
    // the mock API call fail, for whatever reason, and it'll give the response object as the reason for failure.
    var result: RouteLocation[] = await RouteLocationApi.loadTodaysRoute(
      1,
      fail
    );

    /**
     * Now let's inspect what we got back and make sure it's OK. This is like an assertion in JUnit.
     * There's a whole bucketload of these, you can see a short list at https://jestjs.io/docs/en/using-matchers
     */
    expect(result).toEqual(mock_route_locs);
  });
});
