import { createSlice } from '@reduxjs/toolkit'
import {LoadUserAction, LogoutUserAction, UserActionTypes, userReduxName} from './UserActions';

// Simple representation of a Truck, just what's needed here
export interface SimpleTruck {
    name: string;
    id: number;
}

export interface RecommendedSimpleTruck {
    truck: SimpleTruck;
    score: number;
    loc: any;
}

// The data field for the state
export interface UserData {
  username: string;
  pfp: any;
  subscribedTrucks: SimpleTruck[];
  ownedTrucks: SimpleTruck[] | undefined;
  owner: boolean;
}

// Create the user state slice
const userSlice = createSlice({
    name: userReduxName,
    initialState: {
        data: {
            username: "",
            pfp: undefined,
            subscribedTrucks: [],
            ownedTrucks: undefined,
            owner: false
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(UserActionTypes.LOAD_USER_ACTION, (state: any, action: LoadUserAction) => {
            state.data = action.payload;
            return state;
        });
        builder.addCase(UserActionTypes.LOGOUT_USER_ACTION, (state: any, action: LogoutUserAction) => {
            state.data = action.payload;
            return state;
        });
    }
});
export default userSlice;
