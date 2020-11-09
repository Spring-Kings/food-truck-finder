package food.truck.api.endpoint;

import food.truck.api.recommendation.StrategySelector;
import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.reviews_and_subscriptions.SubscriptionView;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;
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

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private StrategySelector ss = new StrategySelector();

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/truck/nearby")
    public String getNearbyTrucks(@RequestParam String location) {
        return ""; //TODO
    }

    @PostMapping(path = "/truck/recommended")
    public List<Truck> getRecommendedTrucks(
            @AuthenticationPrincipal AbstractUser u,
            @RequestBody UserPreferences location
    ) {
        // Prepare with empty results, and visit to get the recommendation strategy
        List<Truck> result;
        ss.setUserPreferences(location);
        ss.setTruckSvc(truckService);
        u.visit(ss);

        // Request and act on the recommendation strategy
        var strategy = ss.getRecommendationStrategy();
        if (strategy != null)
            result = strategy.selectTrucks();
        else
            result = new ArrayList<>();

        // return the results set
        return result.stream().sequential().limit(location.getNumRequested()).collect(Collectors.toList());
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

    @Secured({"ROLE_OWNER"})
    @PostMapping("/truck/create")
    public Truck createTruck(@AuthenticationPrincipal User u, @RequestBody CreateTruckParams data) {
        return truckService.createTruck(u.getId(), data.truckName);
    }

    @Secured({"ROLE_OWNER"})
    @DeleteMapping("/truck/delete/{truckId}")
    public void deleteTruck(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        var t = truckService.findTruckById(truckId);
        if (t.isPresent()) {
            var truck = t.get();
            if (!truck.getUserId().equals(u.getId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);

            truckService.deleteTruck(truckId);
        } else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
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
    @Secured("ROLE_OWNER")
    public List<Truck> getTruckByUser(@AuthenticationPrincipal User u) {
        return truckService.findTruck(u.getId());
    }

    @Secured({"ROLE_OWNER"})
    @PutMapping("/truck/update")
    public Optional<Truck> updateTruck(@AuthenticationPrincipal User u, @RequestBody UpdateTruckParams data) {
        var t = truckService.findTruckById(data.truckId);
        if (t.isPresent()) {
            var truck = t.get();
            if (!u.getId().equals(truck.getUserId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
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
        if (truck.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return routeService.findRouteByTruck(truck.get());
    }

    @Secured("ROLE_OWNER")
    @DeleteMapping("/truck/routes-delete/{routeId}")
    public void deleteRoute(@AuthenticationPrincipal User u, @PathVariable long routeId) {
        var r = routeService.findRouteById(routeId);
        if (r.isPresent()) {
            var route = r.get();
            if (!route.getTruck().getUserId().equals(u.getId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);

            routeService.deleteRoute(routeId);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
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
    public boolean updateRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody UpdateRouteParams data) {
        return routeService.updateRoute(data.routeId, Optional.ofNullable(data.newName), Optional.ofNullable(data.newActive));
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
    public Optional<SubscriptionView> subscribe(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        var t = truckService.findTruckById(truckId);
        if (t.isEmpty()) {
            return Optional.empty();
        }
        var truck = t.get();

        // Prevent an owner from subscribing to their own truck.
        if (!u.getId().equals(truck.getUserId())) {
            var sub = new Subscription();
            sub.setTruck(truck);
            sub.setUser(u);

            return Optional.of(subscriptionService.saveSubscription(sub)).map(SubscriptionView::of);
        } else {
            return Optional.empty();
        }
    }

    @Secured({"ROLE_USER"})
    @GetMapping("/truck/{truckId}/subscription")
    public Optional<SubscriptionView> subscribedToTruck(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        var subs = subscriptionService.findSubsByUser(u);
        var iter = subs.stream()
            .filter(sub -> sub.getTruck().getId().equals(truckId))
            .map(SubscriptionView::of)
            .iterator();
        if (iter.hasNext()) {
            return Optional.of(iter.next());
        }
        return Optional.empty();
    }

    @Secured({"ROLE_USER"})
    @DeleteMapping("/truck/{truckId}/unsubscribe")
    public void unsubscribe(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        var t = truckService.findTruckById(truckId);
        if (t.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription does not exist");
        }
        var truck = t.get();
        var subs = subscriptionService.findSubsByUser(u);
        var filteredSubs = subs
            .stream()
            .filter(sub -> sub.getTruck().getId().equals(truck.getId()))
            .iterator();
        if (filteredSubs.hasNext()) {
            var sub = filteredSubs.next();
            subscriptionService.deleteSubscription(sub);
        }
    }
}
