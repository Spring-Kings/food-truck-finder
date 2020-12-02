import React, {useEffect, useState} from 'react';
import {NotificationListProps} from "./NotificationListComponent";
import {useRouter} from "next/router";
import {Button, Dialog, DialogContent, DialogTitle, Grid, IconButton} from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { StyledDialogTitle } from '../util/StyledDialogTitle';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';

function NotificationWatcherComponent(props: NotificationListProps) {
  const router = useRouter();
  const [initialized, setInitialized]: [boolean, any] = useState(false);
  const [notify, setNotify]: [boolean, any] = useState(false);
  const [notified, setNotified]: [boolean, any] = useState(false);
  const [checkAlert, setCheckAlert]: [boolean, any] = useState(false);
  const reloadNotifications = async () => {
    await props.loadNotificationsFromBackend();
    setCheckAlert(true);
  };
  const notifyUnread = () => {
    const foundItem = props.data.notifications.find((notification) => !notification.read);
    if (foundItem !== null && foundItem !== undefined) {
      setNotify(true);
    }
  };
  const redirectToNotifications = () => {
    setNotified(true);
    router.push('/notifications');
  }

  useEffect(() => {
      if (!initialized) {
        reloadNotifications();
        setInitialized(true);
      }
    },
    [] // No state dependencies --> only run once
  );
  useEffect(() => {
    const timer = setInterval(reloadNotifications, 15000);
    return () => clearInterval(timer);
  }, [initialized]);

  useEffect(() => {
    if (initialized && checkAlert)
      notifyUnread();
  }, [props.data.notifications, checkAlert, initialized]);

  return (
    <>
      <IconButton color="inherit"
                  onClick={() => router.push('/notifications')}>
        {initialized && notify ? <NotificationsActiveIcon/> : <NotificationsIcon/>}
      </IconButton>
      <Dialog open={notify && !notified} fullWidth>
        <StyledDialogTitle onClose={() => setNotified(true)}>
          You have unread notifications!
        </StyledDialogTitle>
        <DialogActions>
          <Button onClick={redirectToNotifications}>See Notifications</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NotificationWatcherComponent;