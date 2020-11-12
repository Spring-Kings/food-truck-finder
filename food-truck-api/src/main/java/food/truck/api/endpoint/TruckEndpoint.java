package food.truck.api.endpoint;

import food.truck.api.recommendation.StrategySelector;
import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.reviews_and_subscriptions.SubscriptionView;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteService;
import food.truck.api.search.IndexingService;
import food.truck.api.search.TruckSearchService;
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

@Log4j2
@RestController
public class TruckEndpoint {
    private final TruckService truckService;
    private final RouteService routeService;
    private final SubscriptionService subscriptionService;
    private final StrategySelector ss;

    @Autowired
    public TruckEndpoint(TruckService truckService, RouteService routeService, SubscriptionService subscriptionService) {
        this.truckService = truckService;
        this.routeService = routeService;
        this.subscriptionService = subscriptionService;
        this.ss = new StrategySelector(truckService);
    }

    @Autowired
    private IndexingService indexingService;

    @Autowired
    private TruckSearchService truckSearchService;

    @GetMapping("/truck/nearby")
    public List<Truck> getNearbyTrucks(@AuthenticationPrincipal AbstractUser u) {
        // TODO: Should radius be configurable?
        return truckService.getTrucksCloseToLocation(u.getPosition(), 10.0);
    }

    @PostMapping(path = "/truck/recommended")
    public List<Truck> getRecommendedTrucks(
            @AuthenticationPrincipal AbstractUser u,
            @RequestBody UserPreferences prefs
    ) {
        var strategy = ss.selectStrategy(u, prefs);

        return strategy.selectTrucks().subList(0, prefs.getNumRequested());
    }

    @GetMapping(path = "/truck/{id}")
    public Optional<Truck> getTruckInfo(@PathVariable long id) {
        return truckService.findTruckById(id);
    }

    @GetMapping(path = "/truck/search")
    public List<Truck> searchTrucks(@RequestParam String search){
       if( search.isEmpty()){
           return new ArrayList<Truck>();
       }
       
        return truckSearchService.getTruckBaseOnText(search);
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
    public Truck createTruck(@AuthenticationPrincipal User u, @RequestBody CreateTruckParams data){
        Truck truck = truckService.createTruck(u.getId(), data.truckName);
        try {
            indexingService.initiateIndexing();
        }catch (InterruptedException e){
            return truck;
        }
        return truck;
    }

    @Secured({"ROLE_OWNER"})
    @DeleteMapping("/truck/delete/{truckId}")
    public void deleteTruck(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        if (!truckService.userOwnsTruck(u, truckId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        truckService.deleteTruck(truckId);
    }

    @GetMapping("/truck/owner")
    @Secured("ROLE_OWNER")
    public List<Truck> getTruckByUser(@AuthenticationPrincipal User u) {
        return truckService.findTruck(u.getId());
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

    @Secured({"ROLE_OWNER"})
    @PutMapping("/truck/update")
    public Optional<Truck> updateTruck(@AuthenticationPrincipal User u, @RequestBody UpdateTruckParams data) {
        if (!truckService.userOwnsTruck(u, data.truckId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        Optional<Truck> truck =  Optional.of(truckService.updateTruck(
                data.truckId,
                Optional.ofNullable(data.name),
                Optional.ofNullable(data.menu),
                Optional.ofNullable(data.textMenu),
                Optional.ofNullable(data.priceRating),
                Optional.ofNullable(data.description),
                Optional.ofNullable(data.schedule),
                Optional.ofNullable(data.foodCategory)
        ));
        try {
            indexingService.initiateIndexing();
        }catch (InterruptedException e){
            return truck;
        }
        return truck;
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

        return routeService.updateRoute(data.routeId, Optional.ofNullable(data.newName), Optional.ofNullable(data.newActive));
    }

    @Value
    private static class PostRouteParams {
        @NonNull String routeName;
        char active;
    }

    @PostMapping("/truck/{truckId}/create-route")
    @Secured("ROLE_OWNER")
    public Route createTruckRoute(@AuthenticationPrincipal User user, @PathVariable long truckId, @RequestBody PostRouteParams data) {
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
    @Secured("ROLE_OWNER")
    public boolean updateTruckRouteLocations(@AuthenticationPrincipal User user, @PathVariable long routeId, @RequestBody List<UpdateRouteLocationParams> data) {
        boolean good = true;
        for (var d : data) {
            if (d.routeLocationId != null && !routeService.userOwnsLocation(user, d.routeLocationId))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            if (!routeService.addOrUpdateLocation(routeId, d.routeLocationId, d.lat, d.lng, d.arrivalTime, d.exitTime))
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

    // TODO: Should this be public?
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
