import { Dispatch } from "redux";
import { NotificationAction, NotificationActionTypes } from "../../redux/notifications/NotificationActions";
import {getNotifications} from "../../api/Notification";
import getUserInfo from "../../util/token";

async function updateNotifications(
  dispatch: Dispatch<NotificationAction>,
) {
  // Fetch notifications
  getNotifications()
    .then(
      (notifications) => {
        // Dispatch update
        dispatch({
          type: NotificationActionTypes.LOAD_NOTIFICATIONS,
          payload: { notifications: notifications }
        });
      },
      (err) => {
        console.log(err);
      }
    );
}

const mapDispatchToProps = (dispatch: Dispatch<NotificationAction>) => {
  return {
    loadNotificationsFromBackend: () => {
      return new Promise<void>(() => {
        updateNotifications(dispatch);
      });
    },
    dispatch,
  };
};

export default mapDispatchToProps;