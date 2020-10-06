import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import userDashboardReducer from '../components/dashboards/user/redux/UserDashboardReducer';
import { userDashboardName } from '../components/dashboards/user/redux/UserDashboardAction'

const reducers = combineReducers({
    [userDashboardName]: userDashboardReducer.reducer
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: [thunk],
        devTools: process.env.NODE_ENV !== 'production'
    });
};