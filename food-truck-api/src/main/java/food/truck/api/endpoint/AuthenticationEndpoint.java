package food.truck.api.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.NonNull;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigInteger;
import java.security.SecureRandom;

@RestController
public class AuthenticationEndpoint {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    private static final SecureRandom RAND = new SecureRandom();

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
        var u = userService.findUser(data.getUsername());
        if (u.isPresent()) {
            return "Error: Username " + data.getUsername() + " already taken";
        } else if (!data.getUsername().matches("[a-zA-Z0-9_]{3,}")) {
            return "Error: Username has invalid characters";
        } else {
            var newU = new User();
            newU.setUsername(data.getUsername());
            newU.setPassword(passwordEncoder.encode(data.getPassword()));
            newU.setEmail(data.getEmail());
            newU = userService.saveUser(newU);
            return "Created user with id " + newU.getId();
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
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginParams data) {
        var u = userService.findUser(data.username);
        if (u.isEmpty()) {
            return new LoginResponse(false, null);
        }
        var user = u.get();
        if (!passwordEncoder.matches(data.password, user.getPassword())) {
            return new LoginResponse(false, null);
        }

        // Password OK
        var bytes = new byte[128];
        RAND.nextBytes(bytes);
        // bytes to hex string
        var token = new BigInteger(1, bytes).toString(16);
        user.setToken(token);
        userService.saveUser(user);

        return new LoginResponse(true, token);
    }
}
