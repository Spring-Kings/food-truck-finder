package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.Review;
import food.truck.api.reviews_and_subscriptions.ReviewService;
import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import food.truck.api.user.UserView;
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

import java.util.List;
import java.util.stream.Collectors;


@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/user/{id}")
    public UserView findUserById(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long id) {
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
    @Secured("ROLE_USER")
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
        if (user.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return subscriptionService.findSubsByUser(user.get()).stream()
                .map(Subscription::getTruck)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/subscriptions")
    public List<Truck> getUserSubscriptions(@RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return subscriptionService.findSubsByUser(user).stream()
                .map(Subscription::getTruck)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}/reviews")
    public List<Review> getUserReviews(@PathVariable long userId) {
        var u = userService.findUserById(userId);
        if (u.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return reviewService.findReviewsByUserId(userId);
    }

    @GetMapping("/user/reviews")
    public List<Review> getUserReviews(@RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return reviewService.findReviewsByUserId(user.getId());
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/delete-review")
    public String deleteReview(@AuthenticationPrincipal User u, @RequestBody long reviewId) {
        return ""; // TODO
    }


}