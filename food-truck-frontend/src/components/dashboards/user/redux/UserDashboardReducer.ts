import { createSlice } from '@reduxjs/toolkit'

import { UserDashboardActionTypes, userDashboardName, LoadSubscriptionsAction } from "./UserDashboardAction"
import defaultState from "./DefaultState"

const userDashboardSlice = createSlice({
    name: userDashboardName,
    initialState: defaultState,
    reducers: {}, // That's for JavaScript users
    extraReducers: (builder) => {
        // THIS is for TypeScript users. The key should be the 'type' value of the action.
        builder.addCase(UserDashboardActionTypes.LOAD_SUBS_ACTION, (state: any, action: LoadSubscriptionsAction) => {
            state.subscribedTrucks = action.payload;
            return state;
        });
    }
});
export default userDashboardSlice;
