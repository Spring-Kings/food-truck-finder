package food.truck.api.endpoint;

import food.truck.api.Constants;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Log4j2
@RestController
@CrossOrigin(origins = Constants.FRONTEND_URL)
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
        @NonNull long userId;
        @NonNull String token;
        @NonNull int score;
        @NonNull int costRating;
        @Nullable
        String reviewText;
    }

    @PostMapping("/truck/{truckId}/reviews")
    public String postTruckReview(@PathVariable long truckId, @RequestBody PostReviewParams data) {
        return ""; // TODO
    }

    @Value
    private static class UpdateTruckParams {
        @NonNull long userId;
        @NonNull String token;
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

    @PutMapping("/truck/{truckId}")
    public String updateTruck(@PathVariable long truckId) {
        return "";
    }

    @GetMapping("/truck/{truckId}/routes")
    public String getRoutes(@PathVariable long truckId) {
        return ""; //TODO
    }
}
