import React, { useState, useEffect } from 'react'
import { DEFAULT_ERR_RESP } from '../api/DefaultResponses';
import { getNearbyTruckLocations } from '../api/Truck';
import TruckLocationMapComponent from "../components/map/truck_location_map/TruckLocationMapComponent"
import {RouteLocation} from "../components/map/route-map/RouteLocation";

function InteractiveMapPage(){
    let [locations, setLocations] = useState<RouteLocation[]>([]);
    let [ready, setReady] = useState<boolean>(false);
    useEffect(() => {
        getNearbyTruckLocations(DEFAULT_ERR_RESP)
            .then(locs => setLocations(locs))
            .then(() => setReady(true))
    });
    return(
        ready && <TruckLocationMapComponent locations={locations} />
            || <p>Please wait...</p>
    )
}

export default InteractiveMapPage;