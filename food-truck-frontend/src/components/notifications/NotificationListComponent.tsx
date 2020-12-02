import React, {useEffect, useState} from "react";
import {Box, Grid, Typography} from "@material-ui/core";
import NotificationComponent from "./NotificationComponent";
import Notification from "../../domain/Notification";
import {NotificationData} from "../../redux/notifications/NotificationReducer";

export type NotificationListProps = {
  data: NotificationData,
  loadNotificationsFromBackend: () => Promise<void>;
};

function NotificationListComponent(props: NotificationListProps) {
  const [notifications, setNotifications]: [Notification[], any] = useState(props.data.notifications);

  useEffect(() => {
    setNotifications(props.data.notifications);
  }, [props.data.notifications]);

  const deleteNotification = (id: number) => {
    if (notifications !== null) {
      let notifs: Notification[] = notifications?.filter((notification: Notification) => notification.id != id);
      setNotifications(notifs);
      props.loadNotificationsFromBackend();
    }
  };

  return (
    <Grid container direction="column" style={{ overflow: "auto" }}>
      <Typography variant="h4">Notifications</Typography>
      { notifications.length > 0 ?
        notifications?.map((notification: Notification) => <NotificationComponent
          key={notification.id}
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

