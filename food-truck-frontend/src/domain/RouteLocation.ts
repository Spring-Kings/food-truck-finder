import {secondsWithinDay, utcTimeStringToDate} from "../util/date-conversions";
import * as t from 'io-ts'
import DateMeta from "../metaclasses/DateMeta";
import LatLngLiteralMeta from "../metaclasses/LatLngLiteralMeta";

export const RouteLocationMeta = t.type({
  routeLocationId: t.number,
  arrivalTime: DateMeta,
  exitTime: DateMeta,
  stopId: t.number,
  coords: LatLngLiteralMeta,

  /**
   * CREATED: Just created, not sent to backend
   * PERSISTED: Loaded from backend
   * DELETED: PERSISTED and deleted in the frontend
   */
  state: t.union([t.literal('CREATED'), t.literal('PERSISTED'), t.literal('DELETED')])
}, "RouteLocation")

export type RouteLocation = t.TypeOf<typeof RouteLocationMeta>

export const wrapsAroundMidnight = (loc: RouteLocation) => secondsWithinDay(loc.exitTime) < secondsWithinDay(loc.arrivalTime);

export const locationsConflict = (loc1: RouteLocation, loc2: RouteLocation) => {
  console.log("Loc1:", loc1, "Loc2:", loc2)
  const arrival1 = secondsWithinDay(loc1.arrivalTime);
  const exit1 = secondsWithinDay(loc1.exitTime);
  const arrival2 = secondsWithinDay(loc2.arrivalTime);
  const exit2 = secondsWithinDay(loc2.exitTime);

  if (!wrapsAroundMidnight(loc1) && !wrapsAroundMidnight(loc2)) {
    console.log("A")
    return arrival1 <= exit2 && exit1 >= arrival2;
  } else if (wrapsAroundMidnight(loc1) && !wrapsAroundMidnight(loc2)) {
    console.log("B")
    return exit1 >= arrival2 || arrival1 <= exit2
  } else if (!wrapsAroundMidnight(loc1) && wrapsAroundMidnight(loc2)) {
    console.log("C")
    return arrival1 <= exit2 || exit1 >= arrival2
  } else {
    console.log("D")
    return true; // If both wrap around, that means they conflict at midnight
  }
}

export const blankRouteLocation = () => ({
  routeLocationId: -1,
  arrivalTime: new Date(),
  exitTime: new Date(),
  stopId: 0,
  coords: {lat: 0, lng: 0},
  state: 'CREATED'
})

export const backendToFrontend = (obj: any, stopId: number) => ({
  ...obj,
  stopId,
  coords: {
    lat: obj.position.latitude,
    lng: obj.position.longitude
  },
  arrivalTime: utcTimeStringToDate(obj.arrivalTime),
  exitTime: utcTimeStringToDate(obj.exitTime),
  state: "PERSISTED"
})

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
