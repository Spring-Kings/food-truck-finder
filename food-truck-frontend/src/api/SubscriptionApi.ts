import api from "../util/api";
import Subscription, {SubscriptionMeta} from "../domain/Subscription";
import {parse} from "../util/type-checking";

export const getSubscriptionForTruck = async (truckId: number, onFail: (e) => void = console.log): Promise<Subscription | null> => {
  try {
    let res = await api.get(`/truck/${truckId}/subscription`);
    if (res.data !== null)
      return parse(SubscriptionMeta, res.data);
  } catch (e) {
    onFail(e)
    return null;
  }
  onFail("Failed to get truck subscription")
  return null
}

export const subscribeToTruck = async (truckId: number, onFail: (e) => void = console.log): Promise<Subscription | null> => {
  let res = await api.post(`/truck/${truckId}/subscribe`);
  if (res.data !== null)
    return parse(SubscriptionMeta, res.data);
  onFail("Failed to subscribe")
  return null
}

export const unsubscribeFromTruck = async (truckId: number, onFail: (e) => void = console.log) => {
  await api.delete(`/truck/${truckId}/unsubscribe`).catch(onFail);
}