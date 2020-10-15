package food.truck.api.endpoint;

import food.truck.api.user.UserView;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.*;

public class UserEndpointTest extends AuthenticationEndpointTest {
    @Test
    public void viewUser() {
        loginSuccess();
        var response = template.getForEntity(base + "user/1", UserView.class);
        var userView = response.getBody();
        assertNotNull(userView);
        assertEquals(1, userView.getId());
        assertEquals("test@example.com", userView.getEmail());
    }

    @Test
    public void updateUser() {
        loginSuccess();
        String path = base + "user";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        var body = new UserEndpoint.EditUserParams("password", "newPassword", "coolEmail@email.com");
        var request = new HttpEntity<>(body, headers);
        var response = template.exchange(path, HttpMethod.PUT, request, Boolean.class);
        var success = response.getBody();
        assertNotNull(success);
        assertTrue(success);

        var viewResp = template.getForEntity(base + "user/1", UserView.class);
        var userView = viewResp.getBody();
        assertNotNull(userView);
        assertEquals("coolEmail@email.com", userView.getEmail());
    }

    @Test
    public void searchUser() {
        loginSuccess();
        var params = new HashMap<String, String>();
        params.put("username", "testUser");
        // For some reason i can't deserialize into a List<UserView>
        var viewResp = template.getForEntity(base + "search-usernames", String.class, params);
        String userView = viewResp.getBody();
        assertNotNull(userView);
        assertTrue(userView.contains("1"));
    }
}
