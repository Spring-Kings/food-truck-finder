import React, {useEffect, useState} from 'react';
import {NotificationListProps} from "./NotificationListComponent";
import getUserInfo from "../../util/token";

function NotificationWatcherComponent(props: NotificationListProps) {
  const [initialized, setInitialized]: [boolean, any] = useState(false);
  const [notified, setNotified]: [boolean, any] = useState(false);
  const notifyUnread = () => {
    const foundItem = props.data.notifications.find((notification) => !notification.read);
    if (foundItem !== null && foundItem !== undefined) {
      setNotified(true);
      alert('You have unread notification(s)');
    }
  };
  useEffect(() => {
    if (!initialized) {
      // Load
      var id: number | undefined = getUserInfo()?.userID;
      if (id !== undefined && id !== 0) {
        props.loadNotificationsFromBackend().then();
      }
      if (!notified) {
        notifyUnread();
      }
      setInitialized(true);
    } else {
      const timer = setInterval(() => {
        var id: number | undefined = getUserInfo()?.userID;
        if (id !== undefined && id !== 0) {
          props.loadNotificationsFromBackend().then();
        }
        if (!notified) {
          notifyUnread();
        }
      }, 5000);
      return () => clearInterval(timer);
    }
    return () => {};
  });
  return (
    <></>
  );
}

export default NotificationWatcherComponent;