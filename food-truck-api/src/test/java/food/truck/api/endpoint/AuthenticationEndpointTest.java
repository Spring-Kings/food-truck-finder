package food.truck.api.endpoint;

import food.truck.api.security.AuthenticationFilter;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Log4j2
public class AuthenticationEndpointTest extends EndpointTest {
    @Test
    public void registerSuccess() throws Exception {
        var req = post("/register")
                .content(asJson(new AuthenticationEndpoint.RegistrationData(
                        "testUser", "test@example.com", "password", false
                )))
                .contentType("application/json");
        var strResponse = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertTrue(strResponse.startsWith("Created user"));
    }

    @Test
    public void loginSuccess() throws Exception {
        var req = post("/login")
                .content(asJson(new AuthenticationFilter.AuthenticationInfo("standardUser", "password")));
        mockMvc.perform(req)
                .andExpect(status().isOk())
                .andExpect(header().exists("token"));
    }

    @Test
    public void loginFail() throws Exception {
        var req = post("/login")
                .content(asJson(new AuthenticationFilter.AuthenticationInfo("standardUser", "badpass")));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError())
                .andExpect(header().doesNotExist("token"));
    }
}