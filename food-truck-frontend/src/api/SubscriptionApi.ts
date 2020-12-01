import api from "../util/api";
import Subscription, {SubscriptionMeta} from "../domain/Subscription";
import {parse} from "../util/type-checking";

export const getSubscriptionForTruck = async (truckId: number): Promise<Subscription | null> => {
  try {
    let res = await api.get(`/truck/${truckId}/subscription`);
    if (res.data == null)
      return null;
    return parse(SubscriptionMeta, res.data);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const subscribeToTruck = async (truckId: number): Promise<Subscription | null> => {
  let res = await api.post(`/truck/${truckId}/subscribe`);
  if (res.data == null)
    return null;
  return parse(SubscriptionMeta, res.data);
}

export const unsubscribeFromTruck = async (truckId: number) => {
  await api.delete(`/truck/${truckId}/unsubscribe`);
}