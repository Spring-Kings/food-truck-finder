import { RouteLocation } from "../components/map/route-map/RouteLocation";
import { backendToFrontend } from "../components/map/route-map/RouteLocation";
import api from "../util/api";

export const getNearbyTruckLocations = async (onFail: (err: any) => void) => {
  let result: RouteLocation[] = [];
  try {
    let ptId: number = 0;
    let trucks: number[] = (
      await api.request({
        url: `/truck/nearby`,
        data: new Date(),
        method: "POST",
      })
    ).data.map((truck: any) => truck.id);
    result = (
      await api.request({
        url: `/truck/locations`,
        data: { truckIds: trucks, now: new Date().toISOString() },
        method: "POST",
      })
    ).data.map((pt: any, ndx: number) => backendToFrontend(pt, trucks[ndx]));
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
