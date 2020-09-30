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
    static class RegistrationData {
        @JsonProperty("Username")
        @NonNull String username;

        @JsonProperty("Email")
        @NonNull String email;

        @JsonProperty("Password")
        @NonNull String password;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegistrationData data) {
        var u = userService.findUser(data.username);
        if (u.isPresent()) {
            return "Error: Username " + data.username + " already taken";
        } else if (!data.username.matches("[a-zA-Z0-9_]{3,}")) {
            return "Error: Invalid username";
        } else {
            var user = userService.createUser(data.username, data.password, data.email);
            return "Created user with id " + user.getId();
        }
    }

    @Value
    private static class LoginParams {
        @JsonProperty("Username")
        @NonNull String username;

        @JsonProperty("Password")
        @NonNull String password;
    }

    @Value
    private static class LoginResponse {
        boolean success;
        String token;
        Long userId;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginParams data) {
        return userService.findUser(data.username)
                .flatMap(u -> userService.authByLogin(data.username, data.password))
                .map(validUser -> new LoginResponse(true, validUser.getToken(), validUser.getId()))
                .orElse(new LoginResponse(false, null, null));
    }
}
