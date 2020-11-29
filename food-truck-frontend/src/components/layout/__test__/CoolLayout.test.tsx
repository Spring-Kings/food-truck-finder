import React from "react";

import { shallow } from "enzyme";
import CoolLayout from "../CoolLayout"
import { Provider } from "react-redux";
import mockStore from "../../../util/test_util/mock_store";

describe("Snapshot test app menu bar", () => {
    test("Renders owner correctly", () => {
        const shallowRender = shallow(
            <Provider store={mockStore()}>
                <CoolLayout children={<div/>} />
            </Provider>
        );
        expect(shallowRender.html()).toMatchSnapshot();
    });

    test("Renders non-owner correctly", () => {
        const shallowRender = shallow(
            <Provider store={mockStore()}>
                <CoolLayout children={<div/>} />
            </Provider>
        );
        expect(shallowRender.html()).toMatchSnapshot();
    });
})
