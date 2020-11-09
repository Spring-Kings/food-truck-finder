package food.truck.api.routes;

import food.truck.api.Position;
import food.truck.api.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class RouteService {
    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteLocationRepository routeLocationRepository;

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
            return false;
        var route = r.get();
        newName.ifPresent(route::setRouteName);
        newActive.ifPresent(route::setActive);
        routeRepository.save(route);
        return true;
    }

    public boolean addDayToRoute(long routeId, DayOfWeek w) {
        var r = findRouteById(routeId);
        if (r.isEmpty())
            return false;
        Route route = r.get();
        if (route.getDays().contains(w))
            return false;
        route.getDays().add(w);
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

    public RouteLocation createLocation(long routeId, double lat, double lng, Instant arrivalTime, Instant exitTime) {
        RouteLocation routeLoc = new RouteLocation();
        routeLoc.setRoute(routeRepository.getOne(routeId)); // .getOne() uses lazy loading, so it doesn't really load the whole route here
        routeLoc.setPosition(new Position(lat, lng));
        routeLoc.setArrivalTime(arrivalTime);
        routeLoc.setExitTime(exitTime);
        return routeLocationRepository.save(routeLoc);
    }

    public boolean addOrUpdateLocation(long routeId, Long locId, double lat, double lng, Instant arrivalTime, Instant exitTime) {
        // If the location doesn't exist, make a new one
        if (locId == null) {
            createLocation(routeId, lat, lng, arrivalTime, exitTime);
            return true;
        }

        // Otherwise, update the old one
        var l = routeLocationRepository.findById(locId);
        if (l.isEmpty())
            return false;
        var loc = l.get();
        loc.setPosition(new Position(lat, lng));
        loc.setArrivalTime(arrivalTime);
        loc.setExitTime(exitTime);
        routeLocationRepository.save(loc);
        return true;
    }

    public void deleteLocation(long locId) {
        routeLocationRepository.deleteById(locId);
    }

    public Set<DayOfWeek> findRouteDaysByRouteId(long routeId) {
        return findRouteById(routeId)
                .map(Route::getDays)
                .orElse(null); // TODO: what to do if not found?
    }

    public List<RouteLocation> findRouteLocationByRouteId(long routeId) {
        return routeLocationRepository.findByRoute_routeId(routeId);
    }

    public Optional<RouteLocation> getCurrentRouteLocation(long routeId) {
        var route = findRouteById(routeId);
        if (route.isEmpty())
            return Optional.empty();
        var r = route.get();
        var now = Instant.now();
        return r.getLocations().stream().filter(
                loc -> now.isAfter(loc.arrivalTime) && now.isBefore(loc.exitTime)
        ).findFirst();
    }


}
