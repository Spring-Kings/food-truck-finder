package food.truck.api.routes;

import food.truck.api.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RouteService {
    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteLocationRepository routeLocationRepository;

    public List<Route> findRouteByTruck(Truck truck) {
        return routeRepository.findByTruck(truck);
    }

    public Optional<Route> findRouteById(long id) {
        return routeRepository.findOneByRouteId(id);
    }

    public Route createRoute(Truck truck, String routeName, char active) {
        Route route = new Route();
        route.setRouteName(routeName);
        route.setTruck(truck);
        route.setActive(active);
        return routeRepository.save(route);
    }

    public boolean addDayToRoute(long routeId, WeekDay w) {
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

    public boolean removeDayFromRoute(long routeId, WeekDay w) {
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
        routeLoc.setLat(lat);
        routeLoc.setLng(lng);
        routeLoc.setArrivalTime(arrivalTime);
        routeLoc.setExitTime(exitTime);
        return routeLocationRepository.save(routeLoc);
    }

    public boolean updateLocation(long locId, double lat, double lng, Instant arrivalTime, Instant exitTime) {
        var l = routeLocationRepository.findById(locId);
        if (l.isEmpty())
            return false;
        var loc = l.get();
        loc.setLat(lat);
        loc.setLng(lng);
        loc.setArrivalTime(arrivalTime);
        loc.setExitTime(exitTime);
        routeLocationRepository.save(loc);
        return true;
    }

    public void deleteLocation(long locId) {
        routeLocationRepository.deleteById(locId);
    }

    public Set<WeekDay> findRouteDaysByRouteId(long routeId) {
        return findRouteById(routeId)
                .map(Route::getDays)
                .orElse(null); // TODO: what to do if not found?
    }

    public List<RouteLocation> findRouteLocationByRouteId(long routeId) {
        return routeLocationRepository.findByRoute_routeId(routeId);
    }

    public void deleteRoute(long routeId) {
        routeLocationRepository.deleteAllByRoute_routeId(routeId);
        routeRepository.deleteById(routeId);
    }
}
