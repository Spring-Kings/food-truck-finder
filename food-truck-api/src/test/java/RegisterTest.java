import food.truck.api.FoodTruckApplication;
import food.truck.api.endpoint.AuthenticationEndpoint;
import food.truck.api.user.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RegisterTest {
    @Autowired
    protected UserService userService;
    @LocalServerPort
    private int port;

    protected String base;
    protected TestRestTemplate template;

    @Before
    public void setUp() throws Exception {
        base = "http://localhost:" + port + "/";
        template = new TestRestTemplate();


    }

    @Test
    public void register() {
        String path = base + "register";
        var data = new AuthenticationEndpoint.RegistrationData("testUser", "test@example.com", "password");
        ResponseEntity<String> response = template.postForEntity(path, data, String.class);
        assertThat(response.getBody(), startsWith("Created user"));
    }
}