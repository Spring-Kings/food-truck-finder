import food.truck.api.security.AuthenticationFilter;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.*;

public class LoginTest extends RegisterTest {
    @Test
    public void loginSuccess() {
        register();
        String path = base + "login";
        var data = new AuthenticationFilter.AuthenticationInfo("testUser", "password");
        ResponseEntity<String> response = template.postForEntity(path, data, String.class);
        System.out.println(response);
        assertNotNull(response.getHeaders().get("token"));
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
