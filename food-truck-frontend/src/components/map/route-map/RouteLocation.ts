import { LatLngLiteral } from "@google/maps";

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

export const backendToFrontend = (pt: any, stopId: number) => ({
  stopId: stopId,
  routeLocationId: pt.routeLocationId,
  coords: {
    lat: pt.lat,
    lng: pt.lng,
  },
  arrivalTime: pt.arrivalTime,
  exitTime: pt.exitTime,
  state: RouteLocationState.PERSISTED,
});

export const frontendToBackend = (pt: RouteLocation, routeId: number) => ({
  routeId: routeId,
  routeLocationId: pt.routeLocationId > 0? pt.routeLocationId : null,
  arrivalTime: pt.arrivalTime,
  exitTime: pt.exitTime,
  lng: pt.coords.lng,
  lat: pt.coords.lat,
});
