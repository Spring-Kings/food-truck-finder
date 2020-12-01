import { LatLngLiteral } from "@google/maps";

/** Regex to ID a floating-point number */
const floatRegex: RegExp = RegExp("[0-9]+\\.?[0-9]*");

/**
 * Loads the current position of the user from local storage
 */
export const getLocationFromStorage = (): LatLngLiteral => {
    let lat: string | null = localStorage.getItem("latitude");
    let lng: string | null = localStorage.getItem("longitude");
  
    // If unknown, calculate
    if (lat === null || lat.match(floatRegex) === null) lat = "0";
    if (lng === null || lng.match(floatRegex) === null) lng = "0";
 
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
}

/**
 * Request to load the location of the user
 * @param force Whether or not to force a reloading of local storage's cache
 */
export const loadUserDefaultLocation = (force?: boolean, callback?: () => void) => {
    if (!navigator.geolocation)
        console.log("Geolocation not supported")
    else if (force || localStorage.getItem("latitude") === null || localStorage.getItem("longitude") === null)
        navigator.geolocation.getCurrentPosition(position => {
            saveUserLocation(position);
            if (callback)
                callback();
        }, geoLocationError);
}

/**
 * Save the current location of the user
 * @param position Current position of the user
 */
export const saveUserLocation = (position: Position) => saveUserLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });

export const saveUserLatLng = (coords: LatLngLiteral) => {
    localStorage.setItem("longitude", String(coords.lng));
    localStorage.setItem("latitude", String(coords.lat));
    console.log("Set position to " + coords.lat + "," + coords.lng);
}

/**
 * Log failure to get location of user
 */
const geoLocationError = () => {
    console.log("Geolocation failure");
}