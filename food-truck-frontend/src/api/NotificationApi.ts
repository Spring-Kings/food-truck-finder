import api from "../util/api";
import {parse} from "../util/type-checking";
import {Notification, NotificationMeta} from "../domain/Notification";

export const getNotifications = async (): Promise<Notification[] | null> => {
  let notifications: Notification[] = [];
  const response = await api.get('/notifications');
  if (response.data == null)
    return null;
  if (response.data) {
    for (const n of response.data) {
      const parsed = parse(NotificationMeta, n);
      if (parsed !== null)
        notifications.push(parsed)
    }
  }
  return notifications;
}

export const sendNotification = async (
  truckId: number,
  message: string,
  onFail?: (res: any) => void
) => {
  let data = {
    truckId: truckId,
    message: message,
  };
  await api.post(`/truck/notification`, data)
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