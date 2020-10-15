package food.truck.api.endpoint;

import food.truck.api.routes.Route;
import food.truck.api.routes.RouteDays;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Column;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import java.sql.Timestamp;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@RestController
public class TruckEndpoint {
    @Autowired
    private TruckService truckService;

    @Autowired
    private RouteService routeService;

    @GetMapping("/nearby-trucks")
    public String getNearbyTrucks(@RequestParam String location) {
        return ""; //TODO
    }

    @GetMapping(path = "/recommended-trucks")
    public String getRecommendedTrucks(
            @AuthenticationPrincipal @Nullable User user,
            @RequestParam String location
    ) {
        return ""; // TODO
    }

    @GetMapping(path = "/truck/{id}")
    public Optional<Truck> getTruckInfo(@PathVariable long id) {
        return truckService.findTruckById(id);
    }

    @GetMapping("/truck/{truckId}/reviews")
    public String getTruckReviews(@PathVariable long truckId) {
        return ""; // TODO
    }

    @Value
    private static class PostReviewParams {
        int score;
        int costRating;
        @Nullable
        String reviewText;
    }

    @PostMapping("/truck/{truckId}/reviews")
    public String postTruckReview(@AuthenticationPrincipal User user, @PathVariable long truckId, @RequestBody PostReviewParams data) {
        return ""; // TODO
    }

    @Value
    public static class CreateTruckParams {
        @Nullable
        String truckName;
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/truck/create")
    public Truck createTruck(@AuthenticationPrincipal User u, @RequestBody CreateTruckParams data) {
        return truckService.createTruck(u.getId(), data.truckName);
    }

    @Secured({"ROLE_USER"})
    @DeleteMapping("/truck/delete/{truckId}")
    public void deleteTruck(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        var t = truckService.findTruckById(truckId);
        t.ifPresent(truck -> {
            System.out.println(truck + " " +  u);
            if (truck.getUserId().equals(u.getId())) {
                truckService.deleteTruck(truckId);
            }
        });
    }

    @Value
    public static class UpdateTruckParams {
        long truckId;
        @Nullable
        String name;
        @Nullable
        String description;
        @Nullable
        Long priceRating;
        @Nullable
        String foodCategory;
        // TODO What about menu/schedule?
        @Nullable
        byte[] menu;
        @Nullable
        String textMenu;
        @Nullable
        byte[] schedule;
    }

    @GetMapping("/truck/owner")
    public List<Truck> getTruckByUser(@AuthenticationPrincipal User u) {
        return truckService.findTruck(u.getId());
    }

    @Secured({"ROLE_USER"})
    @PutMapping("/truck/update")
    public Optional<Truck> updateTruck(@AuthenticationPrincipal User u, @RequestBody UpdateTruckParams data) {
        var t = truckService.findTruckById(data.truckId);
        if (t.isPresent()) {
            var truck = t.get();
            if (!u.getId().equals(truck.getUserId())) {
                return Optional.empty();
            }
            return Optional.of(truckService.updateTruck(
                    truck,
                    Optional.ofNullable(data.name),
                    Optional.ofNullable(data.menu),
                    Optional.ofNullable(data.textMenu),
                    Optional.ofNullable(data.priceRating),
                    Optional.ofNullable(data.description),
                    Optional.ofNullable(data.schedule),
                    Optional.ofNullable(data.foodCategory)
            ));
        }
        return Optional.empty();
    }

    @GetMapping("/truck/{truckId}/routes")
    public List<Route> getRoutes(@PathVariable long truckId) {
        Optional<Truck> truck = truckService.findTruckById(truckId);
        if (truck == null || truck.isEmpty()) {
            return new LinkedList<Route>();
        }

        return routeService.findRoutebyTruck(truck.get());
    }

    @DeleteMapping("/truck/routes-delete/{routeId}")
    public void deleteRoute(@AuthenticationPrincipal User u, @PathVariable long routeId) {
        routeService.deleteRoute(routeId);
    }

    @Value
    private static class UpdateRouteParams {
        long routeId;
        @Nullable
        String newRouteName;
        @NonNull List<String> locations; // TODO: This isn't strings
        boolean active;
    }

    @PutMapping("/truck/{truckId}/routes-put")
    public String updateRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody UpdateRouteParams data) {
        return ""; // TODO
    }

    // TODO: How to represent data?
    @PutMapping("/truck/{truckId}/schedule")
    public String updateSchedule(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody String data) {
        return ""; // TODO
    }

    @Value
    private static class PostRouteParams {
        String routeName;
        char active;
    }

    @PostMapping("/truck/{truckId}/create-route")
    public Route createTruckRoute(@AuthenticationPrincipal User user, @PathVariable long truckId, @RequestBody PostRouteParams data) {
        Optional<Truck> truck = truckService.findTruckById(truckId);
        if (truck == null || truck.isEmpty()) {
            return new Route();
        }
        return routeService.createRoute(truck.get(), data.routeName, data.active); // TODO
    }

    @Value
    private static class UpdateRouteLocationParams {
        long routeLocationId;
        long routeId;
        @Nullable
        Timestamp arrivalTime;
        @Nullable
        Timestamp exitTime;
        @Nullable
        Double lng;
        @Nullable
        Double lat;
    }

    @GetMapping("/truck/route/locations/{routeId}")
    public List<RouteLocation> getRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId) {
        return routeService.findRouteLocationByRouteId(routeId);
    }

    @PostMapping("/truck/route/locations/{routeId}")
    public void updateTruckRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId, @RequestBody List<UpdateRouteLocationParams> data) {
        routeService.updateLocations(data.stream()
                .map(e -> new RouteLocation(e.routeLocationId, e.routeId, e.arrivalTime, e.exitTime, e.lng, e.lat))
                .collect(Collectors.toList()))
        ;
    }

    @DeleteMapping("/truck/route/locations/{routeId}")
    public void deleteTruckRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId, @RequestBody List<UpdateRouteLocationParams> data) {
        routeService.deleteLocations(data.stream()
                .map(e -> new RouteLocation(e.routeLocationId, e.routeId, e.arrivalTime, e.exitTime, e.lng, e.lat))
                .collect(Collectors.toList()))
        ;
    }

    @GetMapping("truck/owner/{userId}")
    public List<Truck> getTrucksByUser(@AuthenticationPrincipal User u, @PathVariable long userId) {
        return truckService.findTruck(userId);
    }
}
