import { RouteLocationState } from "../../../components/map/route-map/RouteLocation";

// Create time data
const today = new Date(Date.now()).toISOString().split("T")[0];
const date = (time: string) => new Date(Date.parse(`${today}T${time}`));

export const times = [
    {
        arrivalTime: date("19:50:02.000Z"),
        exitTime: date("22:50:02.000Z")
    },
    {
        arrivalTime: date("23:00:25.000Z"),
        exitTime: date("05:59:25.000Z"),
    }
]

// Frontend oracle
export const FRONTEND_ORACLE = [
    {
        stopId: 1,
        routeLocationId: 1,
        coords: {
            lat: 31.65412677407011,
            lng: -97.25308838295484
        },
        arrivalTime: times[0].arrivalTime,
        exitTime: times[0].exitTime,
        state: RouteLocationState.PERSISTED
    },
    {
        stopId: 2,
        routeLocationId: 2,
        coords: {
            lat: 31.683346883572508,
            lng: -97.2063964884236
        },
        arrivalTime: times[1].arrivalTime,
        exitTime: times[1].exitTime,
        state: RouteLocationState.PERSISTED
    }
]

// Backend oracle
export const ORACLE_ROUTE_ID = 111;
export const BACKEND_ORACLE = [
    {
        routeId: ORACLE_ROUTE_ID,
        routeLocationId: 1,
        lat: 31.65412677407011,
        lng: -97.25308838295484,
        arrivalTime: times[0].arrivalTime,
        exitTime: times[0].exitTime,
    },
    {
        routeId: ORACLE_ROUTE_ID,
        routeLocationId: 2,
        lat: 31.683346883572508,
        lng: -97.2063964884236,
        arrivalTime: times[1].arrivalTime,
        exitTime: times[1].exitTime,
    }
]