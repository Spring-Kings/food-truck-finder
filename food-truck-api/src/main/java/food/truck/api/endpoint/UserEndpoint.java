package food.truck.api.endpoint;

import food.truck.api.ReviewsAndSubscriptions.Review;
import food.truck.api.ReviewsAndSubscriptions.ReviewService;
import food.truck.api.ReviewsAndSubscriptions.Subscription;
import food.truck.api.ReviewsAndSubscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/user/{id}")
    public User findUserById(@AuthenticationPrincipal @Nullable User viewer, @PathVariable long id) {
        var user = userService.findUserById(id);
        if (user.isPresent()) {
            user.get().setPassword("[REDACTED]"); // probably shouldn't expose this
            return user.get();
        }
        return null;
    }

    @Value
    private static class EditUserParams {
        @Nullable
        String newPassword;
        @Nullable
        String newEmail;
    }

    @PutMapping("/user")
    public String editUser(@AuthenticationPrincipal User u, @RequestBody EditUserParams data) {
        return ""; // TODO
    }

    @GetMapping("/search-usernames")
    public List<User> searchUsernames(@RequestParam String username) {
        return userService.searchUsernames(username);
    }


    @GetMapping("/user/{id}/subscriptions")
    public List<Truck> getUserSubscriptions(@AuthenticationPrincipal @Nullable User u, @PathVariable long id) {
        var user = userService.findUserById(id);
        List<Truck> trucks = new LinkedList<>();
        subscriptionService.findSubsByUser(user.get()).stream().forEach(s -> trucks.add(s.getTruck()));
        return trucks;
    }

    @PostMapping("/user/subscribe")
    public String subscribe(@AuthenticationPrincipal User u, @RequestBody long truckId) {
        return ""; // TODO
    }

    @PostMapping("/user/unsubscribe")
    public String unsubscribe(@AuthenticationPrincipal User u, @RequestBody long subscriptionId) {
        return ""; // TODO
    }

    @GetMapping("/user/{userId}/reviews")
    public List<Review> getUserReviews(@AuthenticationPrincipal @Nullable User viewer, @PathVariable long userId) {
        return reviewService.findReviewsByUserId(userId);
    }

    @GetMapping("/user/reviews")
    public List<Review> getUserReviews(@RequestParam String username) {
        List<User> users = userService.searchUsernames(username);
        if(users.isEmpty()){
            return null;
        }
        return reviewService.findReviewsByUserId(users.get(0).getId());
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/delete-review")
    public String deleteReview(@AuthenticationPrincipal User u, @RequestBody long reviewId) {
        return ""; // TODO
    }


}
