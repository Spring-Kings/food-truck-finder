import { createSlice } from '@reduxjs/toolkit'

import { UserDashboardActionTypes, userDashboardName, AddTruckAction } from "./UserDashboardAction"
import defaultState from "./DefaultState"

const userDashboardSlice = createSlice({
    name: userDashboardName,
    initialState: defaultState,
    reducers: {}, // That's for JavaScript users
    extraReducers: (builder) => {
        // THIS is for TypeScript users. The key should be the 'type' value of the action.
        builder.addCase(UserDashboardActionTypes.ADD_TRUCK_ACTION, (state: any, action: AddTruckAction) => {
            console.log(`New truck: ${action.payload}`);
            state.subscribedTrucks = state.subscribedTrucks.concat(action.payload);
            return state;
        });
    }
});
export default userDashboardSlice;
