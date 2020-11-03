package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
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
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;

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

    @Autowired
    private SubscriptionService subscriptionService;

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
        @NonNull
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

        return routeService.findRouteByTruck(truck.get());
    }

    @DeleteMapping("/truck/routes-delete/{routeId}")
    public void deleteRoute(@AuthenticationPrincipal User u, @PathVariable long routeId) {
        routeService.deleteRoute(routeId);
    }

    @Value
    private static class UpdateRouteParams {
        long routeId;
        Optional<String> newName;
        Optional<Boolean> newActive;
    }

    @PutMapping("/truck/{truckId}/update-route")
    public boolean updateRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody UpdateRouteParams data) {
        return routeService.updateRoute(data.routeId, data.newName, data.newActive);
    }

    @Value
    private static class PostRouteParams {
        @NonNull String routeName;
        char active;
    }

    @PostMapping("/truck/{truckId}/create-route")
    public Route createTruckRoute(@AuthenticationPrincipal User user, @PathVariable long truckId, @RequestBody PostRouteParams data) {
        Optional<Truck> truck = truckService.findTruckById(truckId);
        if (truck.isEmpty()) {
            return new Route();
        }
        return routeService.createRoute(truck.get(), data.routeName, Character.toUpperCase(data.active) == 'Y'); // TODO
    }


    @GetMapping("/truck/route/locations/{routeId}")
    public List<RouteLocation> getRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId) {
        return routeService.findRouteLocationByRouteId(routeId);
    }

    @Value
    private static class UpdateRouteLocationParams {
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
    public boolean updateTruckRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId, @RequestBody List<UpdateRouteLocationParams> data) {
        // TODO check permissions
        boolean good = true;
        for (var d : data) {
            if (!routeService.updateLocation(routeId, d.routeLocationId, d.lat, d.lng, d.arrivalTime, d.exitTime))
                good = false;
        }
        return good;
    }

    @DeleteMapping("/truck/route/locations")
    public void deleteTruckRouteLocations(@AuthenticationPrincipal User user, @RequestBody @NonNull List<Long> locationIds) {
        // TODO check permissions
        for (long l : locationIds) {
            routeService.deleteLocation(l);
        }
    }

    @GetMapping("truck/owner/{userId}")
    public List<Truck> getTrucksByUser(@AuthenticationPrincipal User u, @PathVariable long userId) {
        return truckService.findTruck(userId);
    }

    @GetMapping("/truck/{truckId}/active-route")
    public Route getTodaysRoute(@PathVariable long truckId) {
        return truckService.getActiveRoute(truckId, LocalDateTime.now().getDayOfWeek());
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/truck/{truckId}/subscribe")
    public Optional<Subscription> subscribe(@AuthenticationPrincipal User u, @RequestBody long truckId) {
        var t = truckService.findTruckById(truckId);
        if (t.isEmpty()) {
            return Optional.empty();
        }
        var truck = t.get();

        var sub = new Subscription();
        sub.setTruck(truck);
        sub.setUser(u);

        return Optional.of(subscriptionService.saveSubscription(sub));
    }

    @Secured({"ROLE_USER"})
    @DeleteMapping("/truck/{truckId}/unsubscribe")
    public void unsubscribe(@AuthenticationPrincipal User u, @RequestBody long truckId) {
        var t = truckService.findTruckById(truckId);
        if (t.isEmpty()) {
            return;
        }
        var truck = t.get();
        var subs = subscriptionService.findSubsByUser(u);
        var filteredSubs = subs
            .stream()
            .filter(sub -> sub.getTruck().equals(truck))
            .iterator();
        if (filteredSubs.hasNext()) {
            var sub = filteredSubs.next();
            subscriptionService.deleteSubscription(sub);
        }
    }
}
