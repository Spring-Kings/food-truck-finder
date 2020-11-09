package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.Review;
import food.truck.api.reviews_and_subscriptions.ReviewService;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import food.truck.api.user.UserView;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;


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
    public UserView findUserById(@AuthenticationPrincipal @Nullable User viewer, @PathVariable long id) {
        return userService.findUserById(id)
                .map(UserView::of)
                .orElse(null);
    }

    @Value
    public static class EditUserParams {
        @NonNull String password;
        @Nullable
        String newPassword;
        @Nullable
        String newEmail;
    }

    @PutMapping("/user")
    public boolean editUser(@AuthenticationPrincipal User u, @RequestBody EditUserParams data) {
        if (!userService.passwordMatches(u, data.password)) {
            return false;
        }

        if (data.newPassword != null) {
            userService.changePassword(u, data.newPassword);
        }
        if (data.newEmail != null) {
            u.setEmail(data.newEmail);
        }
        userService.saveUser(u);
        return true;
    }

    @GetMapping("/search-usernames")
    public List<UserView> searchUsernames(@RequestParam String username) {
        return userService.searchUsernames(username).stream()
                .map(UserView::of)
                .collect(Collectors.toList());
    }


    @GetMapping("/user/{id}/subscriptions")
    public List<Truck> getUserSubscriptions(@PathVariable long id) {
        var user = userService.findUserById(id);
        List<Truck> trucks = new LinkedList<>();
        if (user.isPresent()) {
            subscriptionService.findSubsByUser(user.get()).forEach(s -> trucks.add(s.getTruck()));
        }

        return trucks;
    }

    @GetMapping("/user/subscriptions")
    public List<Truck> getUserSubscriptions(@RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        List<Truck> trucks = new LinkedList<>();
        if(user != null) {
            subscriptionService.findSubsByUser(user).forEach(s -> trucks.add(s.getTruck()));
        }
        return trucks;
    }

    @GetMapping("/user/{userId}/reviews")
    public List<Review> getUserReviews(@PathVariable long userId) {
        return reviewService.findReviewsByUserId(userId);
    }

    @GetMapping("/user/reviews")
    public List<Review> getUserReviews(@RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        if(user == null){
            return List.of();
        }
        return reviewService.findReviewsByUserId(user.getId());
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/delete-review")
    public String deleteReview(@AuthenticationPrincipal User u, @RequestBody long reviewId) {
        return ""; // TODO
    }


}