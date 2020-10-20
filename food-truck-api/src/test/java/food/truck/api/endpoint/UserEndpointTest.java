package food.truck.api.endpoint;

import food.truck.api.user.UserView;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserEndpointTest extends EndpointTest {
    @Test
    public void viewUser() {
        long id = userService.findUserByUsername("standardUser").get().getId();
        UserView result = guestClient.get()
                .uri("/user/{id}", id)
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserView.class).returnResult().getResponseBody();

        assertEquals("aaa@aaa", result.getEmail());
    }

    /*
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
    }*/
}
