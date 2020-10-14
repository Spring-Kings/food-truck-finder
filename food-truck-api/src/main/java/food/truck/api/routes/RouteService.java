package food.truck.api.routes;

import food.truck.api.truck.Truck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Route createRoute(Truck truck, String routeName){
        Route route = new Route();
        route.setRouteName(routeName);
        route.setTruck(truck);
        return routeRepository.save(route);
    }

}
