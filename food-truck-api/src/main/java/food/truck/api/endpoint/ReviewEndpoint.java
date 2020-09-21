package food.truck.api.endpoint;

import food.truck.api.Constants;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@CrossOrigin(origins = Constants.FRONTEND_URL)
public class ReviewEndpoint {
    // TODO: Should this be part of TruckEndpoint.getTruckInfo?
    @GetMapping(path = "/truck-reviews/{id}")
    public String getReviewsByTruck(@PathVariable long id) {
        return ""; // TODO
    }

    @Value
    private static class PostReviewParams {
        @NonNull String username;
        @NonNull String token;
        @NonNull int score;
        @NonNull int costScore;
        @Nullable
        String reviewText;
    }

    @PostMapping(path = "/review")
    public String postReview(@RequestBody PostReviewParams data) {
        return ""; // TODO
    }
}
