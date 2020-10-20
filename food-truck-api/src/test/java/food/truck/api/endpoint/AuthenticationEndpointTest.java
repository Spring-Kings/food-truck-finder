package food.truck.api.endpoint;

import food.truck.api.security.AuthenticationFilter;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Log4j2
public class AuthenticationEndpointTest extends EndpointTest {
    protected void ensureNoTestUser() {
        userService.findUserByUsername("testUser")
                .ifPresent(u -> userService.deleteUser(u.getId()));
    }

    protected void ensureTestUser() {
        if (!userService.usernameIsTaken("testUser"))
            userService.createUser("testUser", "password", "test@test", false);
    }

    @Test
    public void registerSuccess() {
        ensureNoTestUser();
        guestClient.post()
                .uri("/register")
                .bodyValue(new AuthenticationEndpoint.RegistrationData("testUser", "test@example.com", "password", false))
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .consumeWith(res -> assertTrue(res.getResponseBody().startsWith("Created user")));
    }

    @Test
    public void loginSuccess() {
        ensureTestUser();
        guestClient.post()
                .uri("/login")
                .bodyValue(new AuthenticationFilter.AuthenticationInfo("testUser", "password"))
                .exchange()
                .expectStatus().isOk()
                .expectHeader().exists("token");
    }

    @Test
    public void loginFail() {
        ensureTestUser();
        guestClient.post()
                .uri("/login")
                .bodyValue(new AuthenticationFilter.AuthenticationInfo("testUser", "badpassword"))
                .exchange()
                .expectStatus().isUnauthorized()
                .expectHeader().doesNotExist("token");
    }
}