import api from "../util/api";
import {backendToFrontend, frontendToBackend, RouteLocation, RouteLocationMeta,} from "../domain/RouteLocation";
import DayOfWeek from "../components/map/route-map/DayOfWeek";
import { Route } from "next/dist/next-server/server/router";
import { AxiosResponse } from "axios";
import {parse} from "../util/type-checking";

export const loadRoutes = async (
  truckId: number,
  onFail?: (res: any) => void
) => {
  let routes: Route[] = [];
  await api.get(`/truck/${truckId}/routes`, {})
    .then(
      (res: AxiosResponse<Route[]>) => {
        routes = res.data;
      },
      (err) => { if (onFail) onFail(err); }
    );
  return routes;
}

export const loadCurrentRoute = async (
  truckId: number,
  onFail: (res: any) => void = console.log
): Promise<RouteLocation[] | null> => {
  let routePts: RouteLocation[] = [];
  let nextStopId: number = 1;

  try {
    const resp = await api.get(`/truck/${truckId}/active-route`);
    if (resp.data?.locations)
      return resp.data.locations
        .map((loc: any) => parse(
          RouteLocationMeta, backendToFrontend(loc, nextStopId++)
        ))
  } catch (e) {
    onFail(e)
    return null
  }
  onFail("Failed to load route")

  return null;
};

export const loadRouteLocations = async (
  routeId: number,
  onFail: (res: any) => void = console.log
) => {
  try {
    const resp = await api.get(`/truck/route/locations/${routeId}`);
    if (resp.data !== null) {
      let nextStopId = 1;
      return resp.data.map((pt: any) => parse(
        RouteLocationMeta, backendToFrontend(pt, nextStopId++)
      ))
    }
  } catch (e) {
    onFail(e)
    return null
  }
  onFail("Failed to load route locations")
  return null;
};

export const updateRouteLocations = async (
  routeId: number,
  routePts: RouteLocation[],
  onSuccess?: (res: any) => void,
  onFail: (res: any) => void = console.log
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
  onFail: (res: any) => void = console.log
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

export const loadRouteIsActive = async (id: number, onFail?: (err: any) => void) => {
  try {
    let response = (await api.get(`/route/${id}`));
    if (response && response.data && response.data.isActive)
      return true;
    return false;
  } catch (error) {
    if (onFail)
      onFail(error);
  }
  return undefined;
}

export const updateRouteDays = async (
  routeId: number,
  days: DayOfWeek[],
  trashedDays: DayOfWeek[],
  onSuccess?: (res: any) => void,
  onFail: (res: any) => void = console.log
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
  onFail: (res: any) => void = console.log
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
