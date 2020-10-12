import { Dispatch } from 'redux'
import { UserDashboardAction, UserDashboardActionTypes } from './UserDashboardAction';

import api from "../../../../util/api";
import getUserInfo from "../../../../util/token";

/**
 * Interface providing the actions that are used by the UserDashboard to update the store.
 */
interface UserDashboardD2P {
    loadSubscriptions: () => void;
}

// Create a constant set of methods to dispatch on
const dispatcher: UserDashboardD2P = {
    loadSubscriptions: () => {
        return (dispatch: Dispatch<UserDashboardAction>) => {
            api.request({
                url: `/user/${getUserInfo()?.userID}/subscriptions`,
                method: "GET"
            }).then(
                response => {
                    dispatch({ type: UserDashboardActionTypes.LOAD_SUBS_ACTION, payload: response.data });
                }, err => {
                    console.log(err);
                }
            );
        }
    }
};
export default dispatcher;
