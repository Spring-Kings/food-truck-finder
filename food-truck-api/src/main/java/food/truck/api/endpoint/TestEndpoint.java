package food.truck.api.endpoint;

import food.truck.api.user.User;
import food.truck.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/authtest1")
    public String authTest() {
        return "Auth test 1";
    }

    @GetMapping("/authtest2")
    public String authTest2(@AuthenticationPrincipal User u) {
        //var user = (User) auth.getDetails();
        return "auth test 2";
    }
}
