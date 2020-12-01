import api from "../util/api";
import {backendToFrontend, frontendToBackend, RouteLocation, RouteLocationMeta,} from "../domain/RouteLocation";
import DayOfWeek from "../components/map/route-map/DayOfWeek";
import {parse} from "../util/type-checking";

export const loadCurrentRoute = async (
  truckId: number,
  onFail?: (res: any) => void
): Promise<RouteLocation[] | null> => {
  let routePts: RouteLocation[] = [];
  let nextStopId: number = 1;

  const resp = await api.get(`/truck/${truckId}/active-route`);
  if (resp.data?.locations)
    return resp.data.locations
      .map((loc: any) => parse(
        RouteLocationMeta, backendToFrontend(loc, nextStopId++)
      ))

  return null;
};

export const loadRouteLocations = async (
  routeId: number,
  onFail?: (res: any) => void
) => {
  const resp = await api.get(`/truck/route/locations/${routeId}`);
  if (resp.data !== null) {
    let nextStopId = 1;
    return resp.data.map((pt: any) => parse(
      RouteLocationMeta, backendToFrontend(pt, nextStopId++)
    ))
  }

  return null;
};

export const updateRouteLocations = async (
  routeId: number,
  routePts: RouteLocation[],
  onSuccess?: (res: any) => void,
  onFail?: (res: any) => void
) => {
  await api
    .request({
      url: `/truck/route/locations/${routeId}`,
      data: routePts.flatMap((pt) => frontendToBackend(pt, routeId)),
      method: "POST",
    })
    .then(onSuccess)
    .catch(onFail);
};

export const deleteRouteLocations = async (
  routeId: number,
  trashedPts: RouteLocation[],
  onSuccess?: (res: any) => void,
  onFail?: (res: any) => void
) => {
  trashedPts.forEach(pt => console.log(pt))
  await api
    .request({
      url: `/truck/route/locations`,
      data: trashedPts.flatMap((pt) => pt.routeLocationId),
      method: "DELETE",
    })
    .then(onSuccess)
    .catch(onFail);
};

export const updateRouteDays = async (
  routeId: number,
  days: DayOfWeek[],
  trashedDays: DayOfWeek[],
  onSuccess?: (res: any) => void,
  onFail?: (res: any) => void
) => {
  await updateDayList(routeId, days, `/route/add-day`, onSuccess, onFail);
  await updateDayList(
    routeId,
    trashedDays,
    `/route/remove-day`,
    onSuccess,
    onFail
  );
};

const updateDayList = async (
  routeId: number,
  days: DayOfWeek[],
  url: string,
  onSuccess?: (res: any) => void,
  onFail?: (res: any) => void
) => {
  for (const v of days) {
    await api
      .post(url, {
        routeId: routeId,
        day_name: v,
      })
      .then(onSuccess)
      .catch(onFail);
  }
};
