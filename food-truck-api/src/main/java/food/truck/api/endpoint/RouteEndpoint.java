package food.truck.api.endpoint;

import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Log4j2
@RestController
public class RouteEndpoint {
    @Autowired
    private RouteService routeService;
    @Autowired
    private TruckService truckService;


    @GetMapping("/route/{routeId}")
    public Route getRoute(@PathVariable long routeId) {
        return routeService.findRouteById(routeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/route/{routeId}/days")
    public Set<DayOfWeek> getRouteDays(@PathVariable long routeId) {
        return routeService.findRouteDaysByRouteId(routeId);
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
        var route = routeService.findRouteById(rd.routeId).get();
        if (route.isActive())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

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
        var route = routeService.findRouteById(rd.routeId).get();
        if (route.isActive())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        DayOfWeek w;
        try {
            w = DayOfWeek.valueOf(rd.day_name);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return routeService.removeDayFromRoute(rd.routeId, w);
    }


    @GetMapping("/truck/{truckId}/routes")
    public List<Route> getRoutes(@PathVariable long truckId) {
        Optional<Truck> truck = truckService.findTruckById(truckId);
        if (truck.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return routeService.findRouteByTruck(truck.get());
    }


    @Secured("ROLE_OWNER")
    @DeleteMapping("/truck/routes-delete/{routeId}")
    public void deleteRoute(@AuthenticationPrincipal User u, @PathVariable long routeId) {
        if (!routeService.userOwnsRoute(u, routeId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        routeService.deleteRoute(routeId);
    }


    @Value
    public static class UpdateRouteParams {
        long routeId;
        @Nullable
        String newName;
        @Nullable
        Boolean newActive;
    }

    @PutMapping("/truck/{truckId}/update-route")
    @Secured("ROLE_OWNER")
    public boolean updateRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody UpdateRouteParams data) {
        if (!routeService.userOwnsRoute(u, data.routeId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        // Throws a CONFLICT status code if set to active and causes conflicts
        return routeService.updateRoute(data.routeId, Optional.ofNullable(data.newName), Optional.ofNullable(data.newActive));
    }


    @Value
    private static class CreateRouteParams {
        @NonNull String routeName;
        char active;
    }

    @PostMapping("/truck/{truckId}/create-route")
    @Secured("ROLE_OWNER")
    public Route createTruckRoute(@AuthenticationPrincipal User user, @PathVariable long truckId, @RequestBody CreateRouteParams data) {
        if (!truckService.userOwnsTruck(user, truckId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        return routeService.createRoute(truckService.findTruckById(truckId).get(), data.routeName, Character.toUpperCase(data.active) == 'Y');
    }


    // TODO: Should all users be able to see route locations?
    @GetMapping("/truck/route/locations/{routeId}")
    public List<RouteLocation> getRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId) {
        return routeService.findRouteLocationByRouteId(routeId);
    }


    @Value
    private static class AddOrUpdateRouteLocationParams {
        Long routeLocationId;
        long routeId;
        @NonNull
        Instant arrivalTime;
        @NonNull
        Instant exitTime;
        double lng;
        double lat;
    }

    @PostMapping("/truck/route/locations/{routeId}")
    @Secured("ROLE_OWNER")
    public boolean addOrUpdateRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId, @RequestBody List<AddOrUpdateRouteLocationParams> data) {
        boolean good = true;

        for (var d : data) {
            if (d.routeLocationId != null && !routeService.userOwnsLocation(user, d.routeLocationId))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            var route = routeService.findRouteById(d.routeId);
            if (route.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            if (route.get().isActive())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

            LocalTime arrival = d.arrivalTime.atOffset(ZoneOffset.UTC).toLocalTime();
            LocalTime exit = d.exitTime.atOffset(ZoneOffset.UTC).toLocalTime();
            if (!routeService.addOrUpdateLocation(routeId, d.routeLocationId, d.lat, d.lng, arrival, exit))
                good = false;
        }
        return good;
    }


    @DeleteMapping("/truck/route/locations")
    @Secured("ROLE_OWNER")
    public void deleteTruckRouteLocations(@AuthenticationPrincipal User user, @RequestBody @NonNull List<Long> locationIds) {
        for (long l : locationIds) {
            if (!routeService.userOwnsLocation(user, l))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            routeService.deleteLocation(l);
        }
    }
}
