import { useEffect } from "react";
import { loadUserDefaultLocation } from "../../util/position";

/**
 * Component for loading the user's current position, if it isn't in localstorage.
 */
const LocationLoaderComponent = () => {
    useEffect(loadUserDefaultLocation, []);
    return <div/>;
}
export default LocationLoaderComponent;
