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

  return (
    <Grid container direction="column" style={{ overflow: "auto" }}>
      {notifications?.map((notification: Notification) => <NotificationComponent notification={notification}/>)}
    </Grid>
  );
}

export default NotificationListComponent;

