import {TruckMeta} from "./Truck";
import * as t from 'io-ts'

export const SubscriptionMeta = t.type({
  id: t.number,
  truck: TruckMeta
}, "Subscription")

export type Subscription = t.TypeOf<typeof SubscriptionMeta>

export default Subscription;