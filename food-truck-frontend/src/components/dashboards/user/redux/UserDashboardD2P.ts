import { Dispatch } from 'redux'
import { UserDashboardAction, UserDashboardActionTypes } from './UserDashboardAction';

import api from "../../../../util/api";
import getUserInfo from "../../../../util/token";

/**
 * Interface providing the actions that are used by the UserDashboard to update the store.
 */
interface UserDashboardD2P {
    addTruck: (name: string) => void;
}

// Create a constant set of methods to dispatch on
const dispatcher: UserDashboardD2P = {
    addTruck: (name: string) => {
        return (dispatch: Dispatch<UserDashboardAction>) => {
            var subscribed : any = api.request({
                url: `/user/${getUserInfo()}/subscriptions`,
                method: "GET"
            });
            dispatch({ type: UserDashboardActionTypes.ADD_TRUCK_ACTION, payload: name });
        }
    }
};
export default dispatcher;
