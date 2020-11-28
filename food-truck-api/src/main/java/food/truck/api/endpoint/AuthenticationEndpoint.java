package food.truck.api.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import food.truck.api.user.UserService;
import lombok.NonNull;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationEndpoint {
    @Autowired
    private UserService userService;

    @Value
    public static class RegistrationData {
        @JsonProperty("username")
        @NonNull String username;

        @JsonProperty("email")
        @NonNull String email;

        @JsonProperty("password")
        @NonNull String password;

        @JsonProperty("owner")
        boolean isOwner;
    }

    @PostMapping("/register")
    public String register(@RequestBody @NonNull RegistrationData data) {
        if (userService.usernameIsTaken(data.username)) {
            return "Error: Username " + data.username + " already taken";
        }
        if (!userService.usernameIsValid(data.username)) {
            return "Error: Username must be 3-30 characters and characters must be alphanumeric or underline.";
        }
        if (!userService.emailIsValid(data.email)) {
            return "Error: Email must contain @ and be between 3 and 100 characters.";
        }
        if (!userService.passwordIsValid(data.password)) {
            return "Error: Password must be 6 to 50 characters.";
        }

        var user = userService.createUser(data.username, data.password, data.email, data.isOwner);
        return "Created user with id " + user.getId();
    }
}
