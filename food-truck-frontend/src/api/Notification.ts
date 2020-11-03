import api from "../util/api";
import {TruckState} from "../components/TruckView";

export interface Notification {
  message: string;
  truck: TruckState;
}

export const getNotifications = async (onFail?: (res: any) => void): Promise<Notification[]> => {
  let notifications: Notification[] = [];

  await api.get(`/notifications`, {})
    .then((response: any) => {
      if (response.data) {
        notifications.concat(response.data);
      }
    })
    .catch(onFail);

  return notifications;
}

export const sendNotification = async (
  truckId: number,
  message: string,
  onFail?: (res: any) => void
) => {
  let config = {
    "params": {
      "truckId": truckId,
      "message": message,
    }
  };
  await api.post(`/truck/notification`, config)
    .catch(onFail);
}