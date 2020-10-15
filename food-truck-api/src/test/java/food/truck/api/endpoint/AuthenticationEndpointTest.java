package food.truck.api.endpoint;

import food.truck.api.security.AuthenticationFilter;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.annotation.Inherited;

import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.*;

public class AuthenticationEndpointTest extends EndpointTest {
    protected String token;

    @Test
    public void register() {
        String path = base + "register";
        var data = new AuthenticationEndpoint.RegistrationData("testUser", "test@example.com", "password", true);
        ResponseEntity<String> response = template.postForEntity(path, data, String.class);
        System.out.println(response);
        assertThat(response.getBody(), startsWith("Created user"));
    }

    @Test
    public void loginSuccess() {
        register();
        String path = base + "login";
        var data = new AuthenticationFilter.AuthenticationInfo("testUser", "password");
        ResponseEntity<String> response = template.postForEntity(path, data, String.class);
        System.out.println(response);
        assertNotNull(response.getHeaders().get("token"));
        token = response.getHeaders().get("token").get(0);
    }

    @Test
    public void loginFail() {
        register();
        String path = base + "login";
        var data = new AuthenticationFilter.AuthenticationInfo("testUser", "badpassword");
        ResponseEntity<String> response = template.postForEntity(path, data, String.class);
        assertNull(response.getHeaders().get("token"));
        assertEquals(response.getStatusCode(), HttpStatus.UNAUTHORIZED);
    }
}