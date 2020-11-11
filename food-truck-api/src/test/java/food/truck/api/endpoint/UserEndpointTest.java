package food.truck.api.endpoint;

import food.truck.api.user.UserView;
import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class UserEndpointTest extends EndpointTest {
    @Test
    public void viewUser() throws Exception {
        var req = get("/user/{id}", data.standardUser.getId());
        String resp = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        UserView u = fromJson(resp, UserView.class);
        assertEquals(UserView.of(data.standardUser), u);
    }

    @Test
    public void updateUser() throws Exception {
        var req = put("/user")
                .content(asJson(new UserEndpoint.EditUserParams("password", "newPass", "coolEmail@aaa")))
                .contentType("application/json")
                .with(user(data.standardUser));
        mockMvc.perform(req)
                .andExpect(status().isOk());
        var user = userService.findUserById(data.standardUser.getId()).get();
        assertEquals(user.getEmail(), "coolEmail@aaa");
        assertTrue(userService.passwordMatches(user, "newPass"));
    }

    @Test
    public void searchUser() throws Exception {
        var req = get("/search-usernames?username={x}", "standardUser");
        String resp = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        var list = fromJsonList(resp, UserView.class);
        assertThat(list, contains(UserView.of(data.standardUser)));
    }
}
