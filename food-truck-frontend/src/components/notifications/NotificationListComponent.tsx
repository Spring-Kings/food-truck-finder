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
    if (notifications !== null) {
      let notifs: Notification[] = notifications?.filter((notification: Notification) => notification.id != id);
      setNotifications(notifs);
    }
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

