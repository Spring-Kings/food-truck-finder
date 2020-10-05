package food.truck.api.endpoint;

import food.truck.api.user.User;
import food.truck.api.user.UserService;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestEndpoint {
    @Autowired
    private UserService userService;

    @Secured({"ROLE_USER"})
    @GetMapping("/authtest1")
    public String authTest(@AuthenticationPrincipal User u) {
        return "You have to be logged in to see this";
    }

    @GetMapping("/authtest2")
    public String authTest2(@AuthenticationPrincipal @Nullable User u) {
        if (u == null) {
            return "You are a guest";
        } else {
            return "You are logged in as " + u.getUsername();
        }
    }
}
