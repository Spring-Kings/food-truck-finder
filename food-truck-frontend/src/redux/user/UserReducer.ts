import { createSlice } from '@reduxjs/toolkit'
import { LoadUserAction, UserActionTypes, userReduxName } from './UserActions';

// Simple representation of a Truck, just what's needed here
export interface SimpleTruck {
    name: string;
    id: number;
}

// The data field for the state
export interface UserData {
  username: string;
  pfp: any;
  subscribedTrucks: SimpleTruck[];
  ownedTrucks: SimpleTruck[] | undefined;
}

// Create the user state slice
const userSlice = createSlice({
    name: userReduxName,
    initialState: {
        data: {
            username: "",
            pfp: undefined,
            subscribedTrucks: [],
            ownedTrucks: undefined
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(UserActionTypes.LOAD_USER_ACTION, (state: any, action: LoadUserAction) => {
            state.data = action.payload;
            return state;
        });
    }
});
export default userSlice;
