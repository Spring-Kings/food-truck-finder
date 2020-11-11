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

export const frontendToBackend = (pt: RouteLocation, routeId: number) => ({
  routeId: routeId,
  routeLocationId: pt.routeLocationId > 0 ? pt.routeLocationId : null,
  arrivalTime: pt.arrivalTime,
  exitTime: pt.exitTime,
  lat: pt.coords.lat,
  lng: pt.coords.lng,
});
