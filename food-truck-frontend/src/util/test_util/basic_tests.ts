import { shallow } from "enzyme";
import { ReactElement } from "react";
import mockUserData from "./token_mock.json"

type GenericFactory<T> = () => T;

// Jogged my Enzyme memory with: https://rjzaworski.com/2018/03/testing-with-typescript-react-and-enzyme

/**
 * Perform your run-of-the-mill snapshot test
 * @param testName Header for the test itself
 * @param component_callback Factory method to create the component to snapshot
 */
export const SNAPSHOT_TEST = <T>(
  testName: string,
  mockApi: () => void,
  unmockApi: () => void,
  component_callback: GenericFactory<ReactElement<T>>
) => {
  describe(testName, () => {  
    /** Mock out modules */
    beforeAll(() => mockApi());

    /** Clear out all the mocks */
    afterAll(() => unmockApi());

    /* Snapshot */
    test("Matches snapshot", () => {
      const component = shallow(component_callback());
      expect(component.html()).toMatchSnapshot();
    });
  });
};

export const ACCESS_TEST = <T>(
  test_name: string,
  component_callback: GenericFactory<ReactElement<T>>
) => {
  // TODO determine how to test
}