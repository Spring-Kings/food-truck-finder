import { NotificationData } from "./NotificationReducer";

export const notificationsReduxName = "notifications";
export enum NotificationActionTypes {
  LOAD_NOTIFICATIONS = "notifications/load",
}

export type NotificationAction = LoadNotificationAction;

export interface LoadNotificationAction {
  type: NotificationActionTypes.LOAD_NOTIFICATIONS;
  payload: NotificationData;
}
