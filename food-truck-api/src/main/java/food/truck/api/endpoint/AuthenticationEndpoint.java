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
        var u = userService.findUserByUsername(data.username);
        if (u.isPresent()) {
            return "Error: Username " + data.username + " already taken";

        }
        // TODO: Max length for username, password, email
        else if (!data.username.matches("[a-zA-Z0-9_]{3,}")) {
            return "Error: Invalid username";
        } else {
            var user = userService.createUser(data.username, data.password, data.email, data.isOwner);
            return "Created user with id " + user.getId();
        }
    }
}
