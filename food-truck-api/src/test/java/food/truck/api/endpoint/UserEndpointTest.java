package food.truck.api.endpoint;

import food.truck.api.user.UserView;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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


    @Test
    public void updateUser() {
        standardUserClient.put()
                .uri("/user")
                .bodyValue(new UserEndpoint.EditUserParams("password", "newPass", "coolEmail@aaa"))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class).isEqualTo(true);
        var user = userService.findUserById(data.standardUser.getId()).get();
        assertEquals(user.getEmail(), "coolEmail@aaa");
        assertTrue(userService.passwordMatches(user, "newPass"));
    }

    @Test
    public void searchUser() {
        guestClient.get()
                .uri("/search-usernames?username={x}", "standardUser")
                .exchange()
                .expectBodyList(UserView.class)
                .contains(UserView.of(data.standardUser));
    }
}
