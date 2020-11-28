import api from "../api";

/** Convenience shorthand so no-one needs to remember all this */
export type Mock = jest.Mock<any, any>;

/**
 * Description of  API test
 */
export type ApiTestDescriptor<T> = {
  /* Name to display for the test */
  testName: string;

  /**
   * Method performing the API call and returning the result desired
   * to be tested against the oracle.
   * 
   * @param mock The mock Axios request method, allowing the call to
   * return data sent to the backend if desired.
   */
  apiCall: (mock: Mock) => T;

  /* Response from the backend */
  mockResponse: any;

  /* Expected response of the frontend API call */
  actualResponse: any;

  /* Indicates whether the backend should throw for the test */
  fails?: boolean;
};

export const SUCCEED_POST = async <T>(apiCall: () => T, setupMock: (mock: Mock) => void, teardownMock: () => void) => {
  let result: any = undefined;
  setupMock(jest.fn().mockImplementationOnce(input => {
    result = input.data;
    return Promise.resolve();
  }));
  await apiCall();
  teardownMock();
  return result;
}

/**
 * Performs a full suite of tests on a mocked-out API. Takes a set of test descriptors
 *
 * @param describeHeader Text to describe the test
 * @param apiCalls Set of call descriptors for the test
 */
const API_SUITE = <T>(
  describeHeader: string,
  apiCalls: ApiTestDescriptor<T>[]
) => {
  /* Mock out Axios API */
  jest.mock("../api");
  /* Create mock request function */
  const MOCK_REQUEST = jest.fn();

  describe(describeHeader, () => {
    /* Hook into the API request */
    beforeAll(() => {
      api.request = MOCK_REQUEST;
    });

    /* Clear the mock request, to ensure no cross-test contamination */
    afterEach(() => {
      MOCK_REQUEST.mockClear();
    });

    apiCalls.forEach((testCall: ApiTestDescriptor<T>) => {
      test(testCall.testName, async () => {
        /* Mock out API request */
        MOCK_REQUEST.mockImplementationOnce(() => {
          if (testCall.fails)
            return Promise.reject("Test requested an error, so here's an error");
          return Promise.resolve({ data: testCall.mockResponse });
        });

        /* Make mock call and ensure returned correct representation */
        const result: T = await testCall.apiCall(MOCK_REQUEST);
        expect(result).toEqual(testCall.actualResponse);
      });
    });
  });
};

export default API_SUITE;