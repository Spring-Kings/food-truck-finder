import api from "../util/api";
import {TruckState} from "../components/TruckView";

export interface Subscription {
  id: number;
  truck: TruckState;
}

export const getSubscriptionForTruck = async (truckId: number) => {
  let res = await api.get(`/truck/${truckId}/subscription`, {});
  return res.data;
}

export const subscribeToTruck = async (truckId: number) => {
  let res = await api.post(`/truck/${truckId}/subscribe`, {});
  return res.data;
}

export const unsubscribeFromTruck = async (truckId: number) => {
  await api.delete(`/truck/${truckId}/unsubscribe`, {});
}