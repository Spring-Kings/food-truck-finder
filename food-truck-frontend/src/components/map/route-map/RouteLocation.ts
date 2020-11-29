import {LatLngLiteral} from "@google/maps";
import {utcTimeStringToDate} from "../../../util/date-conversions";

/**
 * CREATED: Just created, not sent to backend
 * PERSISTED: Loaded from backend
 * DELETED: PERSISTED and deleted in the frontend
 */
export enum RouteLocationState {
  CREATED,
  PERSISTED,
  DELETED,
}

// Diff from backend structure:
// - Missing routeId
// / Lat/Lng => LatLngLiteral
// + Added stopId
// + Added state
export interface RouteLocation {
  routeLocationId: number;
  arrivalTime: Date;
  exitTime: Date;

  stopId: number;
  coords: LatLngLiteral;
  state: RouteLocationState;

  readonly [x: string]: number | LatLngLiteral | Date | RouteLocationState;
}

export const wrapsAroundMidnight = (loc: RouteLocation) => loc.exitTime < loc.arrivalTime;

export const locationsConflict = (loc1: RouteLocation, loc2: RouteLocation) => {
  if (!wrapsAroundMidnight(loc1) && !wrapsAroundMidnight(loc2))
    return loc1.arrivalTime <= loc2.exitTime && loc1.exitTime >= loc2.arrivalTime;
  else if (wrapsAroundMidnight(loc1) && !wrapsAroundMidnight(loc2))
    return loc1.exitTime >= loc2.arrivalTime || loc1.arrivalTime <= loc2.exitTime;
  else if (!wrapsAroundMidnight(loc1) && wrapsAroundMidnight(loc2))
    return loc1.arrivalTime <= loc2.exitTime || loc1.exitTime >= loc2.arrivalTime;
  else
    return true; // If both wrap around, that means they conflict at midnight
}

export const blankRouteLocation = () => ({
  routeLocationId: -1,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: {lat: 0, lng: 0},
  state: RouteLocationState.CREATED,
})

export const backendToFrontend = (pt: any, stopId: number) => {
  return {
    stopId: stopId,
    routeLocationId: pt.routeLocationId,
    coords: {
      lat: pt.position.latitude,
      lng: pt.position.longitude,
    },
    arrivalTime: utcTimeStringToDate(pt.arrivalTime),
    exitTime: utcTimeStringToDate(pt.exitTime),
    state: RouteLocationState.PERSISTED,
  }
}

export const frontendToBackend = (pt: RouteLocation, routeId: number) => {
  let result: any = {
    routeId: routeId,
    routeLocationId: pt.routeLocationId > 0 ? pt.routeLocationId : null,
    arrivalTime: pt.arrivalTime,
    exitTime: pt.exitTime,
    lat: pt.coords.lat,
    lng: pt.coords.lng,
  };
  console.log(result)
  return result;
}
