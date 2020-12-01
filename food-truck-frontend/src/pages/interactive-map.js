import React, { useState, useEffect } from 'react'
import { DEFAULT_ERR_RESP } from '../api/DefaultResponses';
import { getNearbyTruckLocations } from '../api/Truck';
import TruckLocationMapComponent from "../components/map/truck_location_map/TruckLocationMapComponent"

function InteractiveMapPage(){
    let [locations, setLocations] = useState([]);
    useEffect(() => async () => setLocations(await getNearbyTruckLocations(DEFAULT_ERR_RESP)));
    return(
        <TruckLocationMapComponent locations={locations} allowChangeLocation={true} />
    )
}

export default InteractiveMapPage;