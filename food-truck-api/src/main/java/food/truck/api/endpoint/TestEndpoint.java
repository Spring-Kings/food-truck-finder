package food.truck.api.endpoint;

import food.truck.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/authtest")
    public String authTest(@RequestParam long id, @RequestParam String token) {
        return userService.authByToken(id, token)
                .map(u -> "Logged in as " + u.getUsername() + " (" + u.getId() + ")")
                .orElse("Not logged in");
    }
}
