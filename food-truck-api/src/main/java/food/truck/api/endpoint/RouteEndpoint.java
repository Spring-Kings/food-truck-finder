package food.truck.api.endpoint;

import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;

@Log4j2
@RestController
public class RouteEndpoint {
    @Autowired
    private RouteService routeService;

    @GetMapping("/route/{routeId}/days")
    public Set<DayOfWeek> getRouteDays(@PathVariable long routeId) {
        return routeService.findRouteDaysByRouteId(routeId);
    }

    @GetMapping("/route/{routeId}/locations")
    public List<RouteLocation> getRouteLocations(@PathVariable long routeId) {
        return routeService.findRouteLocationByRouteId(routeId);
    }

    @Value
    public static class AddRouteDayParams {
        long routeId;
        @NonNull String day_name;
    }

    @PostMapping("/route/add-day")
    @Secured("ROLE_OWNER")
    public boolean addDayToRoute(@AuthenticationPrincipal User u, @RequestBody AddRouteDayParams rd) {
        if (!routeService.userOwnsRoute(u, rd.routeId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        DayOfWeek w;
        try {
            w = DayOfWeek.valueOf(rd.day_name);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return routeService.addDayToRoute(rd.routeId, w);
    }

    @Value
    public static class RemoveRouteDayParams {
        long routeId;
        @NonNull String day_name;
    }

    @PostMapping("/route/remove-day")
    @Secured("ROLE_OWNER")
    public boolean removeDayFromRoute(@AuthenticationPrincipal User u, @RequestBody RemoveRouteDayParams rd) {
        if (!routeService.userOwnsRoute(u, rd.routeId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        DayOfWeek w;
        try {
            w = DayOfWeek.valueOf(rd.day_name);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
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
    @Secured("ROLE_OWNER")
    public RouteLocation createRouteLocation(@AuthenticationPrincipal User u, @RequestBody PostLocationParams l) {
        if (!routeService.userOwnsRoute(u, l.routeId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        var arrival = l.arrivalTime.atOffset(ZoneOffset.UTC).toLocalTime();
        var exit = l.exitTime.atOffset(ZoneOffset.UTC).toLocalTime();
        return routeService.createLocation(l.routeId, l.lat, l.lng, arrival, exit);
    }
}
