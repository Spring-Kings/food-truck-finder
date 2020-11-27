import {Dispatch} from "redux";
import {NotificationAction, NotificationActionTypes} from "../../redux/notifications/NotificationActions";
import {getNotifications} from "../../api/Notification";

async function updateNotifications(dispatch: Dispatch<NotificationAction>)
  : Promise<void> {
  // Fetch notifications
  getNotifications()
    .then(
      (notifications) => {
        // Dispatch update
        dispatch({
          type: NotificationActionTypes.LOAD_NOTIFICATIONS,
          payload: {notifications: notifications}
        });
      },
      (err) => {
        console.log(err);
      }
    );
}

const mapDispatchToProps = (dispatch: Dispatch<NotificationAction>) => {
  return {
    loadNotificationsFromBackend: () => updateNotifications(dispatch),
    dispatch,
  };
};

export default mapDispatchToProps;