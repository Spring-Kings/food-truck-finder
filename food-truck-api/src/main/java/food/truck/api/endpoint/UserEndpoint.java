package food.truck.api.endpoint;

import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @Value
    static class RegistrationData {
        @NonNull String username;
        @NonNull String email;
        @NonNull String password;
    }

    @PostMapping("/user")
    public String saveUser(@RequestBody RegistrationData data) {
        var u = userService.findUser(data.getUsername());
        if (u.isPresent()) {
            return "Error: User already present";
        } else {
            // TODO: Hash the password, etc.
            // TODO: Check username has only valid characters
            // TODO: Check username isn't too similar to others (e.g. same but space at end)
            var newU = new User();
            newU.setUsername(data.getUsername());
            newU.setPassword(data.getPassword());
            newU.setEmail(data.getEmail());
            newU = userService.saveUser(newU);
            return "Created user with id " + newU.getId();
        }
    }

    @GetMapping("/user/{id}")
    public User findUserById(@PathVariable Long id, @RequestParam long stalkerUserId, @RequestParam String stalkerToken) {
        // TODO: check permissions for stalker?
        var user = userService.findUser(id);
        return user.orElse(null);
    }

    @Value
    private static class EditUserParams {
        long userId;
        @Nullable
        String newPassword;
        @Nullable
        String newEmail;
    }

    @PutMapping("/user")
    public String editUser(@RequestBody EditUserParams data) {
        return ""; // TODO
    }

    @GetMapping("/search-usernames")
    public List<User> searchUsernames(@RequestParam String username) {
        return userService.searchUsernames(username);
    }


    @GetMapping("/user/{id}/subscriptions")
    public String getUserSubscriptions(@PathVariable long id, @RequestParam String username, @RequestParam String token) {
        return ""; // TODO
    }

    @Value
    private static class SubscribeParams {
        long truckId;
        @NonNull String token;
    }

    @PostMapping("/user/{id}/subscriptions")
    public String subscribe(@PathVariable long id, @RequestBody SubscribeParams data) {
        return ""; // TODO
    }

    @DeleteMapping("/user/{id}/subscriptions/{subscriptionId}")
    public String unsubscribe(@PathVariable long id, @PathVariable long subscriptionId, @RequestParam String token) {
        return ""; // TODO
    }

    @GetMapping("/user/{userId}/reviews")
    public String getUserReviews(@PathVariable long userId, @RequestParam long stalkerUserId, @RequestParam String stalkerToken) {
        // TODO: check permissions for stalker?
        return ""; // TODO
    }

    @DeleteMapping("/user/{userId}/reviews")
    public String deleteReview(@PathVariable long userId, @RequestParam long reviewId, @RequestParam String token) {
        return ""; // TODO
    }


}
