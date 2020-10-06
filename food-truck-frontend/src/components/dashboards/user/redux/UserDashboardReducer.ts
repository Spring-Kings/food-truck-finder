import { createSlice } from '@reduxjs/toolkit'

import { UserDashboardActionTypes, userDashboardName, AddTruckAction } from "./UserDashboardAction"
import defaultState from "./DefaultState"

const userDashboardSlice = createSlice({
    name: userDashboardName,
    initialState: defaultState,
    reducers: {}, // That's for JavaScript users
    extraReducers: {
        // THIS is for TypeScript users. The key should be the 'type' value of the action.
        [UserDashboardActionTypes.ADD_TRUCK_ACTION]: (state: any, action: AddTruckAction) => {
            state.foodTrucks.concat(action.payload);
            return state;
        }
    }
});
export default userDashboardSlice;
