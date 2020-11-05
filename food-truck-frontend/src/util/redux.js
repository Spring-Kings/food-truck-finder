import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import userReducer from "../redux/user/UserReducer";
import { userReduxName } from "../redux/user/UserActions";

import notificationsReducer from "../redux/notifications/NotificationReducer";
import { notificationsReduxName } from "../redux/notifications/NotificationActions";

const reducers = combineReducers({
    [userReduxName]: userReducer.reducer,
    [notificationsReduxName]: notificationsReducer.reducer
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: [thunk],
        devTools: process.env.NODE_ENV !== 'production'
    });
};