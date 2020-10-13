import { Dispatch } from "redux";
import {
  UserDashboardAction,
  UserDashboardActionTypes,
} from "./UserDashboardAction";

import api from "../../../../util/api";
import getUserInfo from "../../../../util/token";
import { AxiosResponse } from "axios";
import UserSubscription from "../../../../domain/Subscription";

/**
 * Interface providing the actions that are used by the UserDashboard to update the store.
 */
interface UserDashboardD2P {
  loadSubscriptions: () => void;
  loadUserFromBackend: () => void;
}

function requestSubscribed(id: number): Promise<AxiosResponse<any>> {
  return api.request({
    url: `/user/${id}/subscriptions`,
    method: "GET",
  });
}

function updateUser(
  dispatch: Dispatch<UserDashboardAction>,
  id: number,
  subscribed: UserSubscription[]
) {
  api
    .request({
      url: `/user/${id}`,
      method: "GET",
    })
    .then(
      (response) => {
        dispatch({
          type: UserDashboardActionTypes.LOAD_PROPS_ACTION,
          payload: {
            username: response.data.username,
            pfp: undefined,
            subscribedTrucks: subscribed,
            isOwner: false
          },
        });
      },
      (err) => {
        console.log(err);
      }
    );
}

// Create a constant set of methods to dispatch on
const dispatcher: UserDashboardD2P = {
  loadSubscriptions: () => {
    return (dispatch: Dispatch<UserDashboardAction>) => {
      var id = getUserInfo()?.userID;
      console.log(id);
      if (id !== undefined)
        requestSubscribed(id).then(
          (response) => {
            dispatch({
              type: UserDashboardActionTypes.LOAD_SUBS_ACTION,
              payload: response.data,
            });
          },
          (err) => {
            console.log(err);
          }
        );
    };
  },
  loadUserFromBackend: () => {
    console.log("create");
    return (dispatch: Dispatch<UserDashboardAction>) => {
      var id: number | undefined = getUserInfo()?.userID;
      if (id !== undefined) {
        requestSubscribed(id).then(
          (response) => updateUser(dispatch, id as number, response.data),
          (err) => {
            console.log(err);
            updateUser(dispatch, id as number, []);
          }
        );
      } else
        console.log(`ERROR: ${id}`);
    };
  },
};
export default dispatcher;
