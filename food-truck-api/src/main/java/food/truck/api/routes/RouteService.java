package food.truck.api.routes;

import food.truck.api.Position;
import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class RouteService {

    /**
     * Number of seconds in a day
     */
    private static final long SECONDS_IN_DAY = 60L * 60L * 24L;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteLocationRepository routeLocationRepository;

    private boolean routeConflicts(Route r, Truck t) {
        if (!r.isActive())
            return false;
        for (var existingRoute : routeRepository.findByTruck(t)) {
            if (!r.routeId.equals(existingRoute.routeId) && existingRoute.conflictsWith(r))
                return true;
        }
        return false;
    }

    public List<Route> findRouteByTruck(Truck truck) {
        return routeRepository.findByTruck(truck);
    }

    public Optional<Route> findRouteById(long id) {
        return routeRepository.findById(id);
    }

    public Route createRoute(Truck truck, String routeName, boolean active) {
        Route route = new Route();
        route.setRouteName(routeName);
        route.setTruck(truck);
        route.setActive(active);

        if (routeConflicts(route, truck))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        return routeRepository.save(route);
    }

    @Transactional
    public void deleteRoute(long routeId) {
        routeLocationRepository.deleteAllByRoute_routeId(routeId);
        routeRepository.deleteById(routeId);
    }

    public boolean updateRoute(long routeId, Optional<String> newName, Optional<Boolean> newActive) {
        var r = routeRepository.findById(routeId);
        if (r.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var route = r.get();

        newName.ifPresent(route::setRouteName);
        newActive.ifPresent(route::setActive);
        if (routeConflicts(route, route.getTruck()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        routeRepository.save(route);
        return true;
    }

    public boolean addDayToRoute(long routeId, DayOfWeek w) {
        var r = findRouteById(routeId);
        if (r.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        Route route = r.get();
        if (route.getDays().contains(w))
            return false;
        route.getDays().add(w);

        if (routeConflicts(route, route.getTruck()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        routeRepository.save(route);
        return true;
    }

    public boolean removeDayFromRoute(long routeId, DayOfWeek w) {
        var r = findRouteById(routeId);
        if (r.isEmpty())
            return false;
        var route = r.get();
        if (!route.getDays().contains(w))
             return false;
        route.getDays().remove(w);
        routeRepository.save(route);
        return true;
    }

    public RouteLocation createLocation(long routeId, double lat, double lng, LocalTime arrivalTime, LocalTime exitTime) {
        var route = findRouteById(routeId);
        if (route.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var r = route.get();

        RouteLocation routeLoc = new RouteLocation();
        routeLoc.setPosition(new Position(lat, lng));
        routeLoc.setArrivalTime(arrivalTime);
        routeLoc.setExitTime(exitTime);
        routeLoc.setRoute(r);
        r.getLocations().add(routeLoc);

        if (routeConflicts(r, r.getTruck()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        return routeLocationRepository.save(routeLoc);
    }

    public boolean addOrUpdateLocation(long routeId, Long locId, double lat, double lng, LocalTime arrivalTime, LocalTime exitTime) {
        // If the location doesn't exist, make a new one
        if (locId == null) {
            createLocation(routeId, lat, lng, arrivalTime, exitTime);
            return true;
        }

        // Otherwise, update the old one
        var l = routeLocationRepository.findById(locId);
        if (l.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        var loc = l.get();
        var newLoc = new RouteLocation();
        newLoc.setPosition(new Position(lat, lng));
        newLoc.setArrivalTime(arrivalTime);
        newLoc.setExitTime(exitTime);
        newLoc.setRouteLocationId(locId);

        var route = findRouteById(routeId);
        if (route.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        var r = route.get();
        r.getLocations().remove(loc);
        r.getLocations().add(newLoc);
        if (routeConflicts(r, r.getTruck()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        routeLocationRepository.save(loc);
        return true;
    }

    public void deleteLocation(long locId) {
        routeLocationRepository.deleteById(locId);
    }

    public Set<DayOfWeek> findRouteDaysByRouteId(long routeId) {
        return findRouteById(routeId)
                .map(Route::getDays)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public List<RouteLocation> findRouteLocationByRouteId(long routeId) {
        return routeLocationRepository.findByRoute_routeId(routeId);
    }

    public Optional<RouteLocation> getCurrentRouteLocation(long routeId) {
        var route = findRouteById(routeId);
        if (route.isEmpty())
            return Optional.empty();
        var r = route.get();

        var now = OffsetDateTime.now(ZoneOffset.UTC).toLocalTime();
        return r.getLocations().stream().filter(
                loc -> fallsOnDayInterval(now, loc.arrivalTime, loc.exitTime)
        ).findFirst();
    }

    public boolean userOwnsRoute(User u, long routeId) {
        var route = findRouteById(routeId);
        if (route.isEmpty())
            return false;
        return route.get().getTruck().getUserId().equals(u.getId());
    }

    public boolean userOwnsLocation(User u, long locationId) {
        var loc = routeLocationRepository.findById(locationId);
        return loc.isPresent() && loc.get().getRoute().getTruck().getUserId().equals(u.getId());
    }

    /**
     * Reports whether now falls on the specified interval, assuming a wraparoung
     * at midnight
     *
     * @param now The current time
     * @param start The start of the interval
     * @param end The end of the interval
     * @return Whether now falls between start and end. If start is greater than end,
     *         returns it assuming that the range wraps at midnight. If start and end
     *         are the same time, it automatically returns false.
     */
    private static boolean fallsOnDayInterval(LocalTime now, LocalTime start, LocalTime end) {
        if (start.isBefore(end))
            return now.isAfter(start) && now.isBefore(end);
        else if (start.isAfter(end))
            return now.isAfter(start) || now.isBefore(end);
        else
            return false;
    }
}
