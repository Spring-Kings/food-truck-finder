package food.truck.api.endpoint;

import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class TruckEndpoint {

    @GetMapping("/nearby-trucks")
    public String getNearbyTrucks(@RequestParam String location) {
        return ""; //TODO
    }

    @GetMapping(path = "/recommended-trucks")
    public String getRecommendedTrucks(
            @RequestParam String location,
            @RequestParam Optional<String> username,
            @RequestParam Optional<String> token
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
        long userId;
        @NonNull String token;
        int score;
        int costRating;
        @Nullable
        String reviewText;
    }
    @PostMapping("/truck/{truckId}/reviews")
    public String postTruckReview(@PathVariable long truckId, @RequestBody PostReviewParams data) {
        return ""; // TODO
    }

    @Value
    private static class UpdateTruckParams {
        long userId;
        @NonNull String token;
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
    public String updateTruck(@RequestBody UpdateTruckParams data) {
        return "";
    }

    @GetMapping("/truck/{truckId}/routes")
    public String getRoutes(@PathVariable long truckId) {
        return ""; //TODO
    }

    @Value
    private static class AddRouteParams {
        long userId;
        @NonNull String token;
        @NonNull String routeName;
    }

    @PostMapping("/truck/{truckId}/routes")
    public String addRoute(@PathVariable long truckId, @RequestBody AddRouteParams data) {
        return ""; // TODO
    }

    @DeleteMapping("/truck/{truckId}/routes/{routeId}")
    public String deleteRoute(@PathVariable long truckId, @PathVariable long routeId, @RequestParam long userId, @RequestParam String token) {
        return ""; // TODO
    }

    @Value
    private static class UpdateRouteParams {
        long userId;
        @NonNull String token;
        long routeId;
        @Nullable
        String newRouteName;
        @NonNull List<String> locations; // TODO: This isn't strings
        boolean active;
    }

    @PutMapping("/truck/{truckId}/routes")
    public String updateRoute(@PathVariable long truckId, @RequestBody UpdateTruckParams data) {
        return ""; // TODO
    }

    @Value
    private static class UpdateScheduleParams {
        long userId;
        @NonNull String token;
        HashMap<DayOfWeek, List<String>> schedule; // TODO (1) Does HashMap work here? (2) How to represent time?
    }

    @PutMapping("/truck/{truckId}/schedule")
    public String updateSchedule(@PathVariable long truckId, @RequestBody UpdateScheduleParams data) {
        return ""; // TODO
    }
}
