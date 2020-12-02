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
export const FRONTEND_ROUTE_ORACLE = {
    active: true,
    days: [ "SUNDAY", "SATURDAY" ],
    routeId: 1,
    routeName: "Weekend",
    truck: {
        description: "Too bad. Waluigi Time",
        id: 1,
        menuContentType: "image/png",
        name: "Waluigi's Taco Stand",
        priceRating: 5,
        starRating: 3,
        tags: [ "Purple", "Waa", "Not Luigi", "Purple Tacos" ],
        userId: 1,
    }
}
export const CURRENT_ROUTE_ORACLE = [
    {
        stopId: 1,
        routeLocationId: 1,
        coords: {
            lat: 31.65412677407011,
            lng: -97.25308838295484
        },
        position: {
            latitude: 31.65412677407011,
            longitude: -97.25308838295484
        },
        arrivalTime: times[0].arrivalTime,
        exitTime: times[0].exitTime,
        state: "PERSISTED" as "PERSISTED"
    },
    {
        stopId: 2,
        routeLocationId: 2,
        coords: {
            lat: 31.683346883572508,
            lng: -97.2063964884236
        },
        position: {
            latitude: 31.683346883572508,
            longitude: -97.2063964884236
        },
        arrivalTime: times[1].arrivalTime,
        exitTime: times[1].exitTime,
        state: "PERSISTED" as "PERSISTED",
    }
]

export const ROUTE_FULL_ORACLE = CURRENT_ROUTE_ORACLE.map((e: any) => ({
    ...e,
    route: FRONTEND_ROUTE_ORACLE
}));

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