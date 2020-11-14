import {Dispatch} from "redux";
import api from "../../util/api";
import getUserInfo from "../../util/token";
import {AxiosResponse} from "axios";
import {UserAction, UserActionTypes} from "../../redux/user/UserActions";
import {SimpleTruck} from "../../redux/user/UserReducer";

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
    url: `/truck/owner/${id}`,
    method: "GET",
  });
  return result.data;
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
        if (response.data.owner) trucks = await requestOwnedTrucks(id);

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

function logout(dispatch: Dispatch<UserAction>) {
  console.log('dispatching logout');
  dispatch({
    type: UserActionTypes.LOGOUT_USER_ACTION,
    payload: {
      username: "",
      pfp: undefined,
      subscribedTrucks: undefined,
      ownedTrucks: undefined
    }
  });
  localStorage.removeItem("authToken");
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
    logoutUser: () => {
      return new Promise<void>(() => {
        console.log('logging out');
        logout(dispatch);
      });
    },
    dispatch,
  };
};

export default mapDispatchToProps;
