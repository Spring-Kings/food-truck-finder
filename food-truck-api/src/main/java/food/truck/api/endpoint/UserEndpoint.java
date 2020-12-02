package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.Review;
import food.truck.api.reviews_and_subscriptions.ReviewService;
import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.user.*;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
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

    @GetMapping("/authenticated")
    @Secured("ROLE_USER")
    public boolean userIsAuthenticated(@AuthenticationPrincipal User user) {
        return true;
    }

    @GetMapping("/get-username")
    public String getUsername(@AuthenticationPrincipal AbstractUser viewer, @RequestParam long id) {
        var user = userService.findUserById(id);
        if (user.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var u = user.get();
        if (!viewer.canView(u))
            return "Anonymous";
        else
            return u.getUsername();
    }

    @GetMapping("/user/{id}")
    public UserView findUserById(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long id) {
        var target = userService.findUserById(id);
        if (target.isEmpty() || !viewer.canView(target.get()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return UserView.of(target.get());
    }

    @Value
    public static class EditUserParams {
        @NonNull String password;
        @Nullable
        String newPassword;
        @Nullable
        String newEmail;
        PrivacySetting newPrivacySetting;
        boolean newOwnerStatus;
    }

    @PutMapping("/user")
    @Secured("ROLE_USER")
    public boolean editUser(@AuthenticationPrincipal User u, @RequestBody EditUserParams data) {
        if (!userService.passwordMatches(u, data.password)) {
            return false;
        }

        if (data.newPassword != null) {
            if (!userService.passwordIsValid(data.newPassword))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            userService.changePassword(u, data.newPassword);
        }
        if (data.newEmail != null) {
            if (!userService.emailIsValid(data.newEmail))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            u.setEmail(data.newEmail);
        }
        u.setPrivacySetting(data.newPrivacySetting);
        u.setOwner(data.newOwnerStatus);

        userService.saveUser(u);

        return true;
    }

    @GetMapping("/search-usernames")
    public UserView searchUsernames(@AuthenticationPrincipal AbstractUser viewer, @RequestParam String username) {
        var user = userService.searchUsernames(username).stream().findFirst();
        if (user.isEmpty() || !viewer.canView(user.get()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return UserView.of(user.get());
    }


    @GetMapping("/user/{id}/subscriptions")
    public List<Truck> getUserSubscriptions(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long id) {
        var user = userService.findUserById(id);
        if (user.isEmpty() || !viewer.canView(user.get()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return subscriptionService.findSubsByUser(user.get()).stream()
                .map(Subscription::getTruck)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/subscriptions")
    public List<Truck> getUserSubscriptions(@AuthenticationPrincipal AbstractUser viewer, @RequestParam String username) {
        User user = userService.loadUserByUsername(username);
        if (user == null || !viewer.canView(user))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return subscriptionService.findSubsByUser(user).stream()
                .map(Subscription::getTruck)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}/reviews")
    public List<Review> getUserReviews(@AuthenticationPrincipal AbstractUser viewer, @PathVariable long userId) {
        var u = userService.findUserById(userId);
        if (u.isEmpty() || !viewer.canView(u.get()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return reviewService.findReviewsByUserId(userId);
    }

}