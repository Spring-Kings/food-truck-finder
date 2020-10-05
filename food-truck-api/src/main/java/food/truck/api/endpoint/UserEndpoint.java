package food.truck.api.endpoint;

import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/user/{id}")
    public User findUserById(@AuthenticationPrincipal @Nullable User viewer, @PathVariable long id) {
        var user = userService.findUserById(id);
        return user.orElse(null);
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
    public String getUserSubscriptions(@AuthenticationPrincipal @Nullable User u, @PathVariable long id) {
        return ""; // TODO
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
    public String getUserReviews(@AuthenticationPrincipal @Nullable User viewer, @PathVariable long userId) {
        return ""; // TODO
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/delete-review")
    public String deleteReview(@AuthenticationPrincipal User u, @RequestBody long reviewId) {
        return ""; // TODO
    }


}
