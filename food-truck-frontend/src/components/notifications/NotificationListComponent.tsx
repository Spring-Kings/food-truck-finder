import React, { useEffect, useState } from "react";
import {Box, Grid, Typography} from "@material-ui/core";
import NotificationComponent from "./NotificationComponent";
import { Notification, getNotifications } from "../../api/Notification";
import { NotificationData } from "../../redux/notifications/NotificationReducer";
import getUserInfo from "../../util/token";

export type NotificationListProps = {
  data: NotificationData,
  loadNotificationsFromBackend: () => Promise<void>;
};

function NotificationListComponent(props: NotificationListProps) {
  const [notifications, setNotifications]: [Notification[], any] = useState([]);
  const [initialized, setInitialized]: [boolean, any] = useState(false);
  const reloadNotifications = () => {
    props.loadNotificationsFromBackend().then();
    setNotifications(props.data.notifications);
  };
  useEffect(() => {
    if (!initialized) {
      // Load
      reloadNotifications();
      setInitialized(true);
    } else {
      const timer = setInterval(reloadNotifications, 5000);
      return () => clearInterval(timer);
    }
    return () => {};
  });

  const deleteNotification = (id: number) => {
    if (notifications !== null) {
      let notifs: Notification[] = notifications?.filter((notification: Notification) => notification.id != id);
      setNotifications(notifs);
    }
  };

  return (
    <Grid container direction="column" style={{ overflow: "auto" }}>
      <Typography variant="h4">Notifications</Typography>
      { notifications.length > 0 ?
        notifications?.map((notification: Notification) => <NotificationComponent
          notification={notification}
          deletedCallback={deleteNotification}
        />)
        : (
          <Box p={4}>
            <Typography variant="h6">Oops! Looks like you don't have any notifications.</Typography>
          </Box>
        )
      }
    </Grid>
  );
}

export default NotificationListComponent;

