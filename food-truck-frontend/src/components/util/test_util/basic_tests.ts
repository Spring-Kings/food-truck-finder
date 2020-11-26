import { shallow } from "enzyme";
import { ReactElement } from "react";

type GenericFactory<T> = () => T;

// Jogged my Enzyme memory with: https://rjzaworski.com/2018/03/testing-with-typescript-react-and-enzyme

/**
 * Perform your run-of-the-mill snapshot test
 * @param component_callback Factory method to create the component to snapshot
 */
const SNAPSHOT_TEST = <T>(component_callback: GenericFactory<ReactElement<T>>) => {
    test("Matches snapshot", () => {
        const component = shallow(component_callback());
        expect(component).toMatchSnapshot();
    })
}

const API_TEST = <T>(api_method: () => T, mock_response: any, real_response: any) => {
    
}
