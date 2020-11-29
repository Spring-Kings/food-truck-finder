import api from "../util/api";
import Subscription, {SubscriptionMeta} from "../domain/Subscription";
import {parse} from "../util/type-checking";

export const getSubscriptionForTruck = async (truckId: number): Promise<Subscription | null> => {
  let res = await api.get(`/truck/${truckId}/subscription`);
  return parse(SubscriptionMeta, res.data);
}

export const subscribeToTruck = async (truckId: number): Promise<Subscription | null> => {
  let res = await api.post(`/truck/${truckId}/subscribe`);
  return parse(SubscriptionMeta, res.data);
}

export const unsubscribeFromTruck = async (truckId: number) => {
  await api.delete(`/truck/${truckId}/unsubscribe`);
}