import api from "../../../util/api";

/**
 * Description of  API test
 */
type ApiTestDescriptor<T> = {
  /* Name to display for the test */
  testName: string;

  /* Method performing the API call and returning the result */
  apiCall: () => T;

  /* Response from the backend */
  mockResponse: any;

  /* Expected response of the frontend API call */
  actualResponse: any;
};

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
  jest.mock("../../util/api");
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
        MOCK_REQUEST.mockImplementationOnce(() =>
          Promise.resolve({ data: testCall.mockResponse })
        );

        /* Make mock call and ensure returned correct representation */
        const result: T = testCall.apiCall();
        expect(result).toEqual(testCall.actualResponse);
      });
    });
  });
};
