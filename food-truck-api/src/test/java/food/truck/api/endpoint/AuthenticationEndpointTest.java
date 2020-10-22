package food.truck.api.endpoint;

import food.truck.api.security.AuthenticationFilter;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Log4j2
public class AuthenticationEndpointTest extends EndpointTest {
    @Test
    public void registerSuccess() {
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
        guestClient.post()
                .uri("/login")
                .bodyValue(new AuthenticationFilter.AuthenticationInfo("standardUser", "password"))
                .exchange()
                .expectStatus().isOk()
                .expectHeader().exists("token");
    }

    @Test
    public void loginFail() {
        guestClient.post()
                .uri("/login")
                .bodyValue(new AuthenticationFilter.AuthenticationInfo("standardUser", "badpassword"))
                .exchange()
                .expectStatus().isUnauthorized()
                .expectHeader().doesNotExist("token");
    }
}