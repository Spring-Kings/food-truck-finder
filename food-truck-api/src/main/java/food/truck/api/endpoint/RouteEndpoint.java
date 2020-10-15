package food.truck.api.endpoint;

import food.truck.api.routes.RouteDays;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.user.User;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@Log4j2
@RestController
public class RouteEndpoint {
    @Autowired
    private RouteService routeService;

    @GetMapping("/route/{routeId}/days")
    public List<RouteDays> getRouteDays(@AuthenticationPrincipal User u, @PathVariable long routeId){
        return routeService.findRouteDaysbyRouteId(routeId);
    }

    @GetMapping("/route/{routeId}/locations")
    public List<RouteLocation> getRouteLocations(@AuthenticationPrincipal User u, @PathVariable long routeId){
        return routeService.findRouteLocationByRouteId(routeId);
    }

    @Value
    public static class PostRouteDaysParams{
        Long routeId;
        String day_name;
    }

    @PostMapping("/route/create-days")
    public RouteDays createRouteDays(@AuthenticationPrincipal User u,@RequestBody PostRouteDaysParams rd){
        return routeService.createRouteDays(rd.routeId, RouteDays.Days.valueOf(rd.day_name));
    }

    @Value
    public static  class PostLocationParams{
        Double lat;
        Double lng;
        Long routeId;
        Timestamp arrivalTime;
        Timestamp exitTime;
    }

    @PostMapping("/route/create-location")
    public RouteLocation createRouteLocation(@AuthenticationPrincipal User u, @RequestBody PostLocationParams  l){
        return routeService.createLocation(l.routeId, l.lat, l.lng, l.arrivalTime, l.exitTime);
    }
}
