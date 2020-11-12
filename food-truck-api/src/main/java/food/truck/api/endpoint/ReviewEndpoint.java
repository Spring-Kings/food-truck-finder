package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.Review;
import food.truck.api.reviews_and_subscriptions.ReviewService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class ReviewEndpoint {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @Autowired
    private TruckService truckService;

    @GetMapping("/reviews/{reviewId}")
    public Review getReviewById(@PathVariable long reviewId) {
        return reviewService.findReviewById(reviewId);
    }

    @GetMapping("/reviews/user")
    public List<Review> getUserReviews(@RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        if(user == null){
            return new LinkedList<Review>();
        }
        return reviewService.findReviewsByUserId(user.getId());
    }

    @GetMapping("/reviews/user/{userId}")
    public List<Review> getUserReviews(@PathVariable long userId) {
        return reviewService.findReviewsByUserId(userId);
    }

    @GetMapping("/reviews/truck/{truckId}")
    public List<Review> getTruckReviews(@PathVariable long truckId) {
        return reviewService.findReviewByTruckId(truckId);
    }

    @GetMapping("/reviews/truck/{truckId}/user")
    public Review getTruckReviews(@PathVariable long truckId, @RequestParam Long userId) {
        var result = reviewService.findReviewForUser(userId, truckId);
        if (!result.isEmpty())
            return result.get();
        else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Requested review does not exist");
    }

    @Value
    private static class PostReviewParams {
        int score;
        int costRating;
        @Nullable
        String reviewText;
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/reviews/truck/{truckId}")
    public Review postTruckReview(@AuthenticationPrincipal User user, @PathVariable long truckId, @RequestBody PostReviewParams data) {
        // Ensure truck exists
        Optional<Truck> truck = truckService.findTruckById(truckId);
        if (truck.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provided truck does not exist");

        // Ensure not rating my own truck
        Truck t = truck.get();
        if (user.getId().equals(t.getUserId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot rate your own truck");

        // Save review
        return reviewService.saveReview(user.getId(), truck.get(), data.score, data.costRating, data.reviewText);
    }

    @Secured({"ROLE_USER"})
    @DeleteMapping("/reviews/truck/{truckId}")
    public boolean deleteReview(@AuthenticationPrincipal User u, @PathVariable long truckId) {
        boolean result = reviewService.deleteReviewByUser(u, truckId);
        if (!result)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find the specified review");
        return true;
    }
}
