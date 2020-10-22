package food.truck.api.routes;

import food.truck.api.endpoint.TruckEndpoint;
import food.truck.api.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
public class RouteService {
    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteLocationRepository routeLocationRepository;

    @Autowired
    private RouteDaysRepository routeDaysRepository;

    public List<Route> findRoutebyTruck(Truck truck){
        return routeRepository.findByTruck(truck);
    }

    public Route createRoute(Truck truck, String routeName, char active){
        Route route = new Route();
        route.setRouteName(routeName);
        route.setTruck(truck);
        route.setActive(active);
        return routeRepository.save(route);
    }

    public List<RouteDays>saveRouteDays(Long routeId, String[] dayNames){
        routeDaysRepository.deleteAll(routeDaysRepository.findByRouteId(routeId));

        List<RouteDays> routeDays = new ArrayList<RouteDays>();
        for(String day : dayNames) {
            RouteDays routeDay = new RouteDays();
            routeDay.setDay(RouteDays.Days.valueOf(day));
            routeDay.setRouteId(routeId);
            routeDays.add(routeDaysRepository.save(routeDay));
        }
        return routeDays;
    }

    public RouteLocation createLocation(Long routeId, Double lat, Double lng, Timestamp arrivalTime, Timestamp exitTime){
        RouteLocation routeLoc = new RouteLocation();
        routeLoc.setRouteId(routeId);
        routeLoc.setLat(lat);
        routeLoc.setLng(lng);
        routeLoc.setArrivalTime(arrivalTime);
        routeLoc.setExitTime(exitTime);
        return routeLocationRepository.save(routeLoc);
    }

    public void updateLocations(List<RouteLocation> locs) {
        routeLocationRepository.saveAll(locs);
    }

    public void deleteLocations(List<RouteLocation> locs) {
        routeLocationRepository.deleteAll(locs);
    }

    public List<RouteDays> findRouteDaysbyRouteId(Long routeId){
        return routeDaysRepository.findByRouteId(routeId);
    }

    public List<RouteLocation> findRouteLocationByRouteId(Long routeId){
        return routeLocationRepository.findByRouteId(routeId);
    }
    public void deleteRoute(Long routeId){
        routeDaysRepository.deleteAll(routeDaysRepository.findByRouteId(routeId));
        routeLocationRepository.deleteAll(routeLocationRepository.findByRouteId(routeId));
        routeRepository.deleteAll(routeRepository.findByRouteId(routeId));
    }
}
