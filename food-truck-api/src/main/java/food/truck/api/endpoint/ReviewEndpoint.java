package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.Review;
import food.truck.api.reviews_and_subscriptions.ReviewService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
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

import javax.annotation.Nonnull;
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

    private void censorReview(AbstractUser viewer, Review r) {
        var user = userService.findUserById(r.getUserId()).get();
        if (!viewer.canView(user))
            r.setUserId(-1L);
    }

    @GetMapping("/reviews/{reviewId}")
    public Review getReviewById(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long reviewId) {
        var review = reviewService.findReviewById(reviewId);
        if (review == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        censorReview(viewer, review);
        return review;
    }

    @GetMapping("/reviews/user")
    public List<Review> getUserReviews(@AuthenticationPrincipal AbstractUser viewer, @RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        if (!viewer.canView(user))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        return reviewService.findReviewsByUserId(user.getId());
    }

    @GetMapping("/reviews/user/{userId}")
    public List<Review> getUserReviews(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long userId) {
        var user = userService.findUserById(userId);
        if(user.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        if (!viewer.canView(user.get()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return reviewService.findReviewsByUserId(userId);
    }

    @GetMapping("/reviews/truck/{truckId}")
    public List<Review> getTruckReviews(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long truckId) {
        var reviews =  reviewService.findReviewByTruckId(truckId);
        reviews.forEach(r -> censorReview(viewer, r));
        return reviews;
    }

    @GetMapping("/reviews/truck/{truckId}/user")
    public Review getTruckReviews(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long truckId, @RequestParam Long userId) {
        var result = reviewService.findReviewForUser(userId, truckId);
        if (result.isPresent()) {
            var user = userService.findUserById(result.get().getUserId()).get();
            if (viewer.canView(user))
                return result.get();
        }
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
        var review = reviewService.findReviewForUser(u.getId(), truckId);
        if (review.isEmpty() || !review.get().getUserId().equals(u.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        boolean result = reviewService.deleteReviewByUser(u, truckId);
        if (!result)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find the specified review");
        return true;
    }
}
