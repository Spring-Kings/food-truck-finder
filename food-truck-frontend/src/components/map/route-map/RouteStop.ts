import { LatLngLiteral } from "@google/maps";

/**
 * CREATED: Just created, not sent to backend
 * PERSISTED: Loaded from backend
 * DELETED: PERSISTED and deleted in the frontend
 */
export enum RoutePointState {
  CREATED,
  PERSISTED,
  DELETED,
}

// Diff from backend structure:
// - Missing routeId
// / Lat/Lng => LatLngLiteral
// + Added stopId
// + Added state
export interface RouteStop {
  routeLocationId: number;
  arrivalTime: Date;
  exitTime: Date;

  stopId: number;
  coords: LatLngLiteral;
  state: RoutePointState;

  readonly [x: string]: number | LatLngLiteral | Date | RoutePointState;
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
  state: RoutePointState.PERSISTED,
});

export const frontendToBackend = (pt: RouteStop, routeId: number) => ({
  routeId: routeId,
  routeLocationId: pt.routeLocationId > 0? pt.routeLocationId : null,
  arrivalTime: pt.arrivalTime,
  exitTime: pt.exitTime,
  lng: pt.coords.lng,
  lat: pt.coords.lat,
});
