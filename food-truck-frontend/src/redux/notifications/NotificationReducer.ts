import {createSlice} from '@reduxjs/toolkit';
import {LoadNotificationAction, NotificationActionTypes, notificationsReduxName} from "./NotificationActions";
import Notification from "../../domain/Notification";

export interface NotificationData {
  notifications: Notification[];
}

const notificationSlice = createSlice({
  name: notificationsReduxName,
  initialState: {
    data: {
      notifications: []
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(NotificationActionTypes.LOAD_NOTIFICATIONS, (state: any, action: LoadNotificationAction) => {
      state.data = action.payload;
      return state;
    });
  }
});

export default notificationSlice;