import React, {Component, useEffect, useState} from "react";
import { Grid } from "@material-ui/core";
import NotificationComponent from "./NotificationComponent";
import { Notification, getNotifications } from "../../api/Notification";

function NotificationListComponent() {
  const [notifications, setNotifications]: [Notification[] | null, any] = useState(null);
  useEffect(() => {
    if (!notifications) {
      updateNotifications().then();
    } else {
      setInterval(updateNotifications, 5000);
    }
  }, []);

  const updateNotifications = async () => {
    const notifs: Notification[] = await getNotifications();
    setNotifications(notifs);
  };

  const deleteNotification = (id: number) => {
    if (notifications == null) {
      return;
    }
    const ndx: number = notifications?.map(notification => notification.id).indexOf(id);
    if (ndx > -1) {
      notifications?.splice(ndx, 1);
    }
    setNotifications(notifications);
  };

  return (
    <Grid container direction="column" style={{ overflow: "auto" }}>
      {
        notifications?.map((notification: Notification) => <NotificationComponent
          notification={notification}
          deletedCallback={deleteNotification}
        />)
      }
    </Grid>
  );
}

export default NotificationListComponent;

