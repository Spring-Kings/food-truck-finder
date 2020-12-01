import {backendToFrontend, RouteLocation, RouteLocationMeta} from "../domain/RouteLocation";
import api from "../util/api";
import {parse} from "../util/type-checking";
import * as t from 'io-ts'
import Truck, {TruckMeta} from "../domain/Truck";

export const getNearbyTruckLocations = async (
  onFail: (err: any) => void
): Promise<RouteLocation[] | null> => {
  const nearbyTrucks = parse(t.array(TruckMeta), (await api.post('/truck/nearby')).data);
  if (nearbyTrucks === null) {
    onFail("Couldn't find nearby trucks");
    return null;
  }

  return getNearbyTruckLocationsById(nearbyTrucks.map(t => t.id), onFail);
};

export const getNearbyTruckLocationsById = async (
  ids: number[],
  onFail: (err: any) => void
): Promise<RouteLocation[] | null> => {
  let result: RouteLocation[] = [];
  try {
    result = (
      await api.request({
        url: `/truck/locations`,
        data: ids,
        method: "POST",
      })
    ).data.map((pt: any, ndx: number) => parse(RouteLocationMeta, backendToFrontend(pt, ids[ndx])));
  } catch (err) {
    result = [];
    onFail(err);
  }
  return result;
};

export const getTruckById = async (truckId: number, onFail: (err: any) => void): Promise<Truck | null> => {
  const resp = await api.get(`/truck/${truckId}`)
  if (resp) {
    return parse(TruckMeta, resp.data)
  }
  return null;
}

export const searchTruckByName = async (search: string, onFail: (err: any) => void): Promise<Truck[] | null> => {
  let result = await api.get(`/truck/search?search=${search}`)
    .catch(onFail);
  if (result) {
    return parse(t.array(TruckMeta), result.data);
  }
  return null;
}

export const deleteTruck = async (truckId: number, onFail: (err: any) => void) => {
  await api.delete(`/truck/delete/${truckId}`, {})
    .catch(onFail);
}

export const getSubscribedUsernames = async (truckId: number, onFail?: (err: any) => void)
  : Promise<string[] | null> => {
  try {
    const resp = await api.get(`/truck/${truckId}/subscribed-usernames`)
    if (resp.data && Array.isArray(resp.data))
      return resp.data;
  } catch (e) {
    if (onFail)
      onFail(e)
  }
  if (onFail)
    onFail("Invalid response")
  return null;
}
