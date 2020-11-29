import {TruckMeta} from "./Truck";
import * as t from 'io-ts'
import DateMeta from "../metaclasses/DateMeta";

export const NotificationMeta = t.type({
  id: t.number,
  message: t.string,
  truck: TruckMeta,
  time: DateMeta,
  read: t.boolean,
  type: t.string
}, "Notification")

export type Notification = t.TypeOf<typeof NotificationMeta>

export default Notification;