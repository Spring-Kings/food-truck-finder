package food.truck.api.endpoint;

import food.truck.api.recommendation.StrategySelector;
import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.reviews_and_subscriptions.SubscriptionView;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocation;
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
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Log4j2
@RestController
public class TruckEndpoint {
    private final TruckService truckService;
    private final SubscriptionService subscriptionService;
    private final StrategySelector ss;

    @Autowired
    public TruckEndpoint(TruckService truckService, SubscriptionService subscriptionService) {
        this.truckService = truckService;
        this.subscriptionService = subscriptionService;
        this.ss = new StrategySelector(truckService, subscriptionService);
    }

    @Autowired
    private IndexingService indexingService;

    @PostConstruct
    public void init() {
        try {
            indexingService.initiateIndexing();
        } catch (InterruptedException e) {
            log.warn(e);
        }
    }

    @Autowired
    private TruckSearchService truckSearchService;

    @PostMapping("/truck/nearby")
    public List<Truck> getNearbyTrucks(@AuthenticationPrincipal AbstractUser u) {
        // TODO: Should radius be configurable?
        return truckService.getTrucksCloseToLocation(u.getPosition(), 10.0);
    }

    @PostMapping("/truck/locations")
    public List<RouteLocation> getTruckLocations(@AuthenticationPrincipal AbstractUser u, @RequestBody @NonNull List<Long> truckIds) {
        List<RouteLocation> trucks = new ArrayList<>();
        for (Long id : truckIds) {
            if (id != null)
                truckService.getCurrentRouteLocation(id).ifPresent(trucks::add);
        }
        return trucks;
    }

    @PostMapping(path = "/truck/recommended")
    public List<Pair<Truck, Double>> getRecommendedTrucks(
            @AuthenticationPrincipal AbstractUser u,
            @RequestBody @NonNull UserPreferences prefs
    ) {
        var strategy = ss.selectStrategy(u, prefs);

        // Get the desired trucks
        var truckList = strategy.getTrucksWithNormalizedScores();
        if (truckList.size() > prefs.getNumRequested())
            truckList = truckList.subList(0, prefs.getNumRequested());
        return truckList;
    }

    @GetMapping(path = "/truck/{id}")
    public Optional<Truck> getTruckInfo(@PathVariable long id) {
        return truckService.findTruckById(id);
    }

    @GetMapping(path = "/truck/search")
    public List<Truck> searchTrucks(@RequestParam String search){
       if( search.isEmpty()){
           return new ArrayList<>();
       }
       
        return truckSearchService.getTruckBaseOnText(search);
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
            log.warn(e);
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
        Double priceRating;
        @Nullable
        Set<String> tags;
    }

    @Secured({"ROLE_OWNER"})
    @PutMapping("/truck/update")
    public Optional<Truck> updateTruck(@AuthenticationPrincipal User u, @RequestBody UpdateTruckParams data) {
        if (!truckService.userOwnsTruck(u, data.truckId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        Optional<Truck> truck =  Optional.of(truckService.updateTruck(
                data.truckId,
                Optional.ofNullable(data.name),
                Optional.ofNullable(data.priceRating),
                Optional.ofNullable(data.description),
                Optional.ofNullable(data.tags)
        ));
        try {
            indexingService.initiateIndexing();
        }catch (InterruptedException e){
            log.warn(e);
        }
        return truck;
    }

    // TODO: Should this be public?
    @GetMapping("truck/owner/{userId}")
    public List<Truck> getTrucksByUser(@AuthenticationPrincipal User u, @PathVariable long userId) {
        return truckService.findTruck(userId);
    }

    @GetMapping("/truck/{truckId}/active-route")
    public Route getTodaysRoute(@PathVariable long truckId) {
        return truckService.getActiveRoute(truckId);
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
        if (!truckService.userOwnsTruck(u, truck.getId())) {
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

    @Secured("ROLE_OWNER")
    @PostMapping("/truck/{truckId}/upload-menu")
    public void uploadMenu(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestParam("file") MultipartFile file) {
        if (!truckService.userOwnsTruck(u, truckId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        var result = truckService.tryUploadMenu(truckId, file);
        if (result != HttpStatus.OK)
            throw new ResponseStatusException(result);
    }
}
