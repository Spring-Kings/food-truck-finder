import React, {ReactElement, useEffect, useState} from 'react';
import {NotificationListProps} from "./NotificationListComponent";
import Router, {useRouter} from "next/router";
import getUserInfo from "../../util/token";
import CreateRouteDialog from "../route/CreateRouteDialog";
import {Button, Dialog, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import Form from "../Form";

function NotificationWatcherComponent(props: NotificationListProps) {
  const router = useRouter();
  const [initialized, setInitialized]: [boolean, any] = useState(false);
  const [notify, setNotify]: [boolean, any] = useState(false);
  const [notified, setNotified]: [boolean, any] = useState(false);
  const reloadNotifications = () => {
    props.loadNotificationsFromBackend();
    notifyUnread();
  };
  const notifyUnread = () => {
    const foundItem = props.data.notifications.find((notification) => !notification.read);
    if (foundItem !== null && foundItem !== undefined) {
      setNotify(true);
    }
  };
  const redirectToNotifications = () => {
    setNotified(true);
    router.replace('/notifications');
  }
  useEffect(() => {
    if (!initialized) {
      reloadNotifications();
      setInitialized(true);
    } else {
      const timer = setInterval(reloadNotifications, 5000);
      return () => clearInterval(timer);
    }
    return () => {};
  });
  return (
    <Dialog open={notify && !notified}>
      <DialogTitle>You have unread notifications!</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <Button variant="contained" onClick={() => setNotified(true)}>OK</Button>
          <Button variant="contained" onClick={redirectToNotifications}>See Notifications</Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationWatcherComponent;