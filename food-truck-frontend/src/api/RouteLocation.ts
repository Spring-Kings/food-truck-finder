import api from "../util/api";
import {
  backendToFrontend,
  frontendToBackend,
  RouteStop,
} from "../components/map/route-map/RouteStop";

export const loadTodaysRoute = async (
  truckId: number,
  onFail?: (res: any) => void
) => {
  var routePts: RouteStop[] = [];
  var nextStopId: number = 1;

  await api
    .request({
      url: `/truck/${truckId}/active-route`,
      method: "GET",
    })
    .then((response) => {
      if (response.data)
        routePts = response.data.map((pt: any) =>
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
  var routePts: RouteStop[] = [];
  await api
    .request({
      url: `/truck/route/locations/${routeId}`,
      method: "GET",
    })
    .then((response: any) => {
      if (response.data != undefined) {
        var nextStopId: number = 1;
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
  routePts: RouteStop[],
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
  trashedPts: RouteStop[],
  onSuccess?: (res: any) => void,
  onFail?: (res: any) => void
) => {
  await api
    .request({
      url: `/truck/route/locations/${routeId}`,
      data: trashedPts.flatMap((pt) => pt.routeLocationId),
      method: "DELETE",
    })
    .then(onSuccess)
    .catch(onFail);
};
