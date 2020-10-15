import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import userReducer from "../redux/user/UserReducer";
import { userReduxName } from "../redux/user/UserActions";

const reducers = combineReducers({
    [userReduxName]: userReducer.reducer
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: [thunk],
        devTools: process.env.NODE_ENV !== 'production'
    });
};