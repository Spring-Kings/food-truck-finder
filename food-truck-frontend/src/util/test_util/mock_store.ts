import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { emptyTruck } from "../../domain/Truck";
import { StoreState } from "../redux";
import user_data from "./user_data.json";

// Learned from: https://github.com/reduxjs/redux-mock-store
// I had a vague memory it existed from way back in the wayback machine
const mockStoreFactory = configureMockStore([thunk]);

/**
 * Factory to generate the mock store state
 */
const mockStateFactory: () => StoreState = () => ({
  user: {
    data: user_data,
  },
  theme: {
    data: {
      isDark: true,
    },
  },
  notifications: {
    data: {
      notifications: [
        {
          id: 0,
          message: "waa",
          truck: emptyTruck(),
          time: new Date(0),
          read: false,
          type: "type",
        },
      ],
    },
  },
});

export default () => mockStoreFactory(mockStateFactory());
