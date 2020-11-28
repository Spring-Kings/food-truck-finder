import api from "../util/api";
import {backendToFrontend, frontendToBackend, RouteLocation,} from "../components/map/route-map/RouteLocation";
import DayOfWeek from "../components/map/route-map/DayOfWeek";

export const loadTodaysRoute = async (
  truckId: number,
  onFail?: (res: any) => void
) => {
  let routePts: RouteLocation[] = [];
  let nextStopId: number = 1;

  await api
    .request({
      url: `/truck/${truckId}/active-route`,
      method: "GET",
      params: {
        now: new Date()
      }
    })
    .then((response) => {
      if (response.data)
        routePts = response.data.locations.map((pt: any) =>
          backendToFrontend(pt, nextStopId++)
        );
    })
    .catch(onFail);
  return routePts;
};

export const loadRouteLocations = async (
  routeId: number,
  onFail?: (res: any) => void
) => {
  let routePts: RouteLocation[] = [];
  await api
    .request({
      url: `/truck/route/locations/${routeId}`,
      method: "GET",
    })
    .then((response: any) => {
      if (response.data != undefined) {
        let nextStopId: number = 1;
        routePts = response.data.map((pt: any) =>
          backendToFrontend(pt, nextStopId++)
        );
      }
    })
    .catch(onFail);

  return routePts;
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
  // Ignore if no locations
  if (trashedPts.length == 0)
    return;

  // Run delete
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
