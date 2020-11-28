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

export const blankRouteLocation = () => ({
  routeLocationId: -1,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: { lat: 0, lng: 0},
  state: RouteLocationState.CREATED,
})

export const backendToFrontend = (pt: any, stopId: number) => {
  // Addition to enable testing--otherwise, milliseconds unpredictably set
  let arrival = utcTimeStringToDate(pt.arrivalTime)
  let exit = utcTimeStringToDate(pt.exitTime)
  arrival?.setMilliseconds(0)
  exit?.setMilliseconds(0)

  // Return mapping
  return {
    stopId: stopId,
    routeLocationId: pt.routeLocationId,
    coords: {
      lat: pt.position.latitude,
      lng: pt.position.longitude,
    },
    arrivalTime: arrival,
    exitTime: exit,
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
  return result;
}
