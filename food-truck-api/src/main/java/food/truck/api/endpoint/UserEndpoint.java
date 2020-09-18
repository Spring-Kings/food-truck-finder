package food.truck.api.endpoint;

import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.Data;
import lombok.NonNull;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to request data
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/user/{id}")
    public User findUserById(@PathVariable Long id) {
        var user = userService.findUser(id);
        return user.orElse(null);
    }

    // Used because we don't have a valid user object from registration form,
    // because the password isn't hashed
    @Data
    static class RegistrationData {
        @NonNull
        private String username;
        @NonNull
        private String email;
        @NonNull
        private String password;
    }

    @PostMapping("/user")
    public User saveUser(@RequestBody RegistrationData data) {
        // TODO: Hash the password

        var u = new User();
        u.setUsername(data.getUsername());
        u.setPassword(data.getPassword());
        u.setEmail(data.getEmail());

        return userService.saveUser(u);
    }
}
