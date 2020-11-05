import api from "../util/api";
import {TruckState} from "../components/TruckView";

export interface Notification {
  id: number;
  message: string;
  truck: TruckState;
  time: Date;
  read: boolean;
}

export const getNotifications = async () => {
  let notifications: Notification[] = [];

  await api.get(`/notifications`, {})
    .then((response: any) => {
      if (response.data) {
        notifications = response.data;
      }
    });

  return notifications;
}

export const sendNotification = async (
  truckId: number,
  message: string,
  onFail?: (res: any) => void
) => {
  let config = {
    truckId: truckId,
    message: message
  };
  await api.post(`/truck/notification`, config)
    .catch(onFail);
}

export const deleteNotification = async (
  notificationId: number,
  onFail?: (res: any) => void
) => {
  await api.delete(`/notification/${notificationId}/delete`, {})
    .catch(onFail);
}

export const setNotificationAsRead = async (
  notificationId: number,
  isRead: boolean,
  onFail?: (res: any) => void
) => {
  await api.put(`/notification/read`, {
    notificationId: notificationId,
    isRead: isRead
  })
    .catch(onFail);
}