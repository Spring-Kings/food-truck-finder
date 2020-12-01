import React, {useEffect, useState} from 'react'
import {DEFAULT_ERR_RESP} from '../api/DefaultResponses';
import {getNearbyTruckLocations} from '../api/TruckApi';
import TruckLocationMapComponent from "../components/map/truck_location_map/TruckLocationMapComponent"
import {RouteLocation} from "../domain/RouteLocation";

function InteractiveMapPage() {
  let [locations, setLocations] = useState<RouteLocation[]>([]);
  let [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    getNearbyTruckLocations(DEFAULT_ERR_RESP)
      .then(locs => {
        if (locs) {
          setLocations(locs);
          setReady(true);
        }
      });
    }, []);
    return(
        ready? <TruckLocationMapComponent locations={locations} allowChangeLocation={true} />
            : <p>Please wait...</p>
    )
}

export default InteractiveMapPage;