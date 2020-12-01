import {backendToFrontend, RouteLocation} from "../domain/RouteLocation";
import api from "../util/api";

export const getNearbyTruckLocations = async (onFail: (err: any) => void) => {
  let result: RouteLocation[] = [];
  try {
    let ptId: number = 0;
    let trucks: number[] = (
      await api.request({
        url: `/truck/nearby`,
        method: "POST",
      })
    ).data.map((truck: any) => truck.id);
    result = await getNearbyTruckLocationsById(trucks, onFail);
  } catch (err) {
    result = [];
    onFail(err);
  }
  return result;
};

export const getNearbyTruckLocationsById = async (ids: number[], onFail: (err: any) => void) => {
  let result: RouteLocation[] = [];
  try {
    result = (
      await api.request({
          url: `/truck/locations`,
          data: ids,
          method: "POST",
      })
    ).data.map((pt: any, ndx: number) => backendToFrontend(pt, ids[ndx]));
  } catch (err) {
    result = [];
    onFail(err);
  }
  return result;
};

export const getTruckById = async (truckId: number, onFail: (err: any) => void) => {
    try {
        // TODO add mediation between the frontend and backend representations
        let result = (await api.get(`/truck/${truckId}`));
        if (result !== undefined) {
            return result.data;
        }
    } catch (err) {
        onFail(err);
    }
    return undefined;
}

export const searchTruckByName = async (search: string, onFail: (err: any) => void) => {
  let result = await api.get(`/truck/search?search=${search}`)
    .catch(onFail);
  if (result) {
    return result.data;
  }
  return [];
}

export const deleteTruck = async (truckId: number, onFail: (err: any) => void) => {
  await api.delete(`/truck/delete/${truckId}`, {})
    .catch(onFail);
}

export const deleteTruckMenu = async (truckId: number, onFail: (err: any) => void) => {
  await api.delete(`/truck/${truckId}/delete-menu`, {})
    .catch(onFail);
}