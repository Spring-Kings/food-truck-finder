package food.truck.api.endpoint;

import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.lang.Nullable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
public class TruckEndpoint {

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
    public String getTruckInfo(@PathVariable long id) {
        return ""; //TODO
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
    private static class UpdateTruckParams {
        long truckId;
        @Nullable
        String newName;
        @Nullable
        String newDescription;
        @Nullable
        Integer newPriceRating;
        @Nullable
        String newFoodCategory;
        // TODO What about menu/schedule?
    }

    @PutMapping("/truck")
    public String updateTruck(@AuthenticationPrincipal User u, @RequestBody UpdateTruckParams data) {
        return "";
    }

    @GetMapping("/truck/{truckId}/routes")
    public String getRoutes(@PathVariable long truckId) {
        return ""; //TODO
    }

    @PostMapping("/truck/{truckId}/routes")
    public String addRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody String routeName) {
        return ""; // TODO
    }

    @DeleteMapping("/truck/{truckId}/routes/{routeId}")
    public String deleteRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @PathVariable long routeId) {
        return ""; // TODO
    }

    @Value
    private static class UpdateRouteParams {
        long routeId;
        @Nullable
        String newRouteName;
        @NonNull List<String> locations; // TODO: This isn't strings
        boolean active;
    }

    @PutMapping("/truck/{truckId}/routes")
    public String updateRoute(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody UpdateRouteParams data) {
        return ""; // TODO
    }

    // TODO: How to represent data?
    @PutMapping("/truck/{truckId}/schedule")
    public String updateSchedule(@AuthenticationPrincipal User u, @PathVariable long truckId, @RequestBody String data) {
        return ""; // TODO
    }
}
