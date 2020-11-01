package food.truck.api;

import lombok.Value;

@Value
public class Location {
    double latitude;
    double longitude;

    public Location(double lat, double lng) {
        latitude = lat;
        longitude = lng;
    }

    public Location() {
        this(0, 0);
    }

    public double latitudeRadians() {
        return latitude * Math.PI / 180;
    }

    public double longitudeRadians() {
        return longitude * Math.PI / 180;
    }

    protected static final int EARTH_RADIUS_MILES = 3959;

    public double distanceInMiles(Location other) {
        //https://www.movable-type.co.uk/scripts/latlong.html
        //haversine formula

        double rLat1 = latitudeRadians();
        double rLat2 = other.latitudeRadians();
        double dLat = rLat2 - rLat1;
        double rLng1 = longitudeRadians();
        double rLng2 = other.longitudeRadians();
        double dLng = rLng2 - rLng1;

        // a = sin²(Δφ/2) + cos φ_1 * cos φ_2 * sin²(Δλ/2)
        double sin1 = Math.sin(dLat / 2);
        double sin2 = Math.sin(dLng / 2);
        double a = sin1 * sin1 + (Math.cos(rLat1) * Math.cos(rLat2) * sin2 * sin2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_MILES * c;
    }
}
