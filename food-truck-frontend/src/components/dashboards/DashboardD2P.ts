import { Dispatch } from "redux";
import api from "../../util/api";
import getUserInfo from "../../util/token";
import { AxiosResponse } from "axios";
import { UserAction, UserActionTypes } from "../../redux/user/UserActions";
import { SimpleTruck } from "../../redux/user/UserReducer";

/**
 * Interface providing the actions that are used by the UserDashboard to update the store.
 */
function requestSubscribed(id: number): Promise<AxiosResponse<any>> {
  return api.request({
    url: `/user/${id}/subscriptions`,
    method: "GET",
  });
}

async function requestOwnedTrucks(
  id: number
): Promise<SimpleTruck[] | undefined> {
  var result: AxiosResponse = await api.request({
    url: `/user/${id}/trucks`,
    method: "GET",
  });
  return result.data.trucks;
}

async function updateUser(
  dispatch: Dispatch<UserAction>,
  id: number,
  subscribed: SimpleTruck[]
) {
  // Fetch user data
  api
    .request({
      url: `/user/${id}`,
      method: "GET",
    })
    .then(
      async (response) => {
        // Get trucks
        var trucks: SimpleTruck[] | undefined = undefined;
        //        if (response.data.isOwner)
        trucks = await requestOwnedTrucks(id);

        // Dispatch update
        dispatch({
          type: UserActionTypes.LOAD_USER_ACTION,
          payload: {
            username: response.data.username,
            pfp: undefined,
            subscribedTrucks: subscribed,
            ownedTrucks: trucks,
          },
        });
      },
      (err) => {
        console.log(err);
      }
    );
}

// Create a constant set of methods to dispatch on
const mapDispatchToProps = (dispatch: Dispatch<UserAction>) => {
  return {
    loadUserFromBackend: () => {
      return new Promise<void>(() => {
        var id: number | undefined = getUserInfo()?.userID;
        if (id !== undefined) {
          requestSubscribed(id).then(
            (response) => updateUser(dispatch, id as number, response.data),
            (err) => {
              console.log(err);
              updateUser(dispatch, id as number, []);
            }
          );
        } else {
          throw "No user logged in!";
        }
      });
    },
    dispatch,
  };
};

export default mapDispatchToProps;
