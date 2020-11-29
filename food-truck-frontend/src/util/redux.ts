import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import userReducer, { UserData } from "../redux/user/UserReducer";
import { userReduxName } from "../redux/user/UserActions";

import notificationsReducer, { NotificationData } from "../redux/notifications/NotificationReducer";
import { notificationsReduxName } from "../redux/notifications/NotificationActions";

import themeReducer, { ThemeData } from "../redux/theme/ThemeReducer";
import { themeReduxName } from "../redux/theme/ThemeActions";

/**
 * Overall type of the store's state. Used for automocking the state
 */
export type StoreState = {
    user: {
        data: UserData;
    },
    notifications: {
        data: NotificationData
    },
    theme: {
        data: ThemeData
    }
}

const reducers = combineReducers({
    [userReduxName]: userReducer.reducer,
    [notificationsReduxName]: notificationsReducer.reducer,
    [themeReduxName]: themeReducer.reducer
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: [thunk],
        devTools: process.env.NODE_ENV !== 'production'
    });
};