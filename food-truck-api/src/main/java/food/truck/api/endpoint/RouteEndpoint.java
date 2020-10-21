package food.truck.api.endpoint;

import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.routes.WeekDay;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Log4j2
@RestController
public class RouteEndpoint {
    @Autowired
    private RouteService routeService;

    @GetMapping("/route/{routeId}/days")
    public Set<WeekDay> getRouteDays(@AuthenticationPrincipal User u, @PathVariable long routeId) {
        return routeService.findRouteDaysByRouteId(routeId);
    }

    @GetMapping("/route/{routeId}/locations")
    public List<RouteLocation> getRouteLocations(@AuthenticationPrincipal User u, @PathVariable long routeId) {
        return routeService.findRouteLocationByRouteId(routeId);
    }

    @Value
    public static class AddRouteDayParams {
        long routeId;
        @NonNull String day_name;
    }

    @PostMapping("/route/add-day")
    public boolean addDayToRoute(@AuthenticationPrincipal User u, @RequestBody AddRouteDayParams rd) {
        WeekDay w;
        try {
            w = WeekDay.valueOf(rd.day_name);
        } catch (IllegalArgumentException e) {
            return false;
        }
        return routeService.addDayToRoute(rd.routeId, w);
    }

    @Value
    public static class RemoveRouteDayParams {
        long routeId;
        @NonNull String day_name;
    }

    @PostMapping("/route/remove-day")
    public boolean removeDayFromRoute(@AuthenticationPrincipal User u, @RequestBody RemoveRouteDayParams rd) {
        WeekDay w;
        try {
            w = WeekDay.valueOf(rd.day_name);
        } catch (IllegalArgumentException e) {
            return false;
        }
        return routeService.removeDayFromRoute(rd.routeId, w);
    }

    @Value
    public static class PostLocationParams {
        double lat;
        double lng;
        Long routeId;
        Instant arrivalTime;
        Instant exitTime;
    }
    @PostMapping("/route/create-location")
    public RouteLocation createRouteLocation(@AuthenticationPrincipal User u, @RequestBody PostLocationParams  l){
        return routeService.createLocation(l.routeId, l.lat, l.lng, l.arrivalTime, l.exitTime);
    }
}
