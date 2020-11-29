import React from "react";

import { shallow } from "enzyme";
import CoolLayout from "../CoolLayout"
import user_data from "../../../util/test_util/user_data.json";
import { SNAPSHOT_TEST } from "../../../util/test_util/basic_tests";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

// Exactly what it says on the tin: a mock store state
const mockState = (isOwner: boolean) => ({
  user: {
      data: {
        owner: isOwner
      }
  },
  theme: {
      data: true
  },
  notifications: {
      data: {}
  }
});

// Learned from: https://github.com/reduxjs/redux-mock-store
// I had a vague memory it existed from way back in the wayback machine
const mockStoreFactory = configureMockStore([thunk]);

describe("Snapshot test app menu bar", () => {
    test("Renders owner correctly", () => {
        const shallowRender = shallow(
            <Provider store={mockStoreFactory(mockState(true))}>
                <CoolLayout children={<div/>} />
            </Provider>
        );
        expect(shallowRender.html()).toMatchSnapshot();
    });

    test("Renders non-owner correctly", () => {
        const shallowRender = shallow(
            <Provider store={mockStoreFactory(mockState(false))}>
                <CoolLayout children={<div/>} />
            </Provider>
        );
        expect(shallowRender.html()).toMatchSnapshot();
    });
})
