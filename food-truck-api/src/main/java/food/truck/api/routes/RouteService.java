package food.truck.api.routes;

import food.truck.api.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
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

    public RouteDays createRouteDays(Long routeId, RouteDays.Days day){
        RouteDays routeDays = new RouteDays();
        routeDays.setDay(day);
        routeDays.setRouteId(routeId);
        return routeDaysRepository.save(routeDays);
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
