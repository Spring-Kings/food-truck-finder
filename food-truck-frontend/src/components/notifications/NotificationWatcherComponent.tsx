import React, {useEffect, useState} from 'react';
import {NotificationListProps} from "./NotificationListComponent";

function NotificationWatcherComponent(props: NotificationListProps) {
  const [initialized, setInitialized]: [boolean, any] = useState(false);
  const [notified, setNotified]: [boolean, any] = useState(false);
  const notifyUnread = () => {
    const foundItem = props.data.notifications.find((notification) => !notification.read);
    console.log(foundItem);
    if (foundItem !== null && foundItem !== undefined) {
      setNotified(true);
      alert('You have unread notification(s)');
    }
  };
  useEffect(() => {
    if (!initialized) {
      // Load
      props.loadNotificationsFromBackend().then();
      if (!notified) {
        notifyUnread();
      }
      setInitialized(true);
    } else {
      const timer = setInterval(() => {
        props.loadNotificationsFromBackend().then();
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