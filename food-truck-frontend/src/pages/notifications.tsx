import React from 'react';
import CoolLayout from '../components/CoolLayout';
import NotificationListComponent from "../components/notifications/NotificationListComponent";

function NotificationsPage() {
  return (
    <CoolLayout>
      <NotificationListComponent/>
    </CoolLayout>
  );
}

export default NotificationsPage;