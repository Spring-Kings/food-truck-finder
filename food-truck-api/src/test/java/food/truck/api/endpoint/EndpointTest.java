package food.truck.api.endpoint;

import food.truck.api.FoodTruckApplication;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class EndpointTest {
//    @InjectMocks
//    AuthenticationEndpoint auth;
//
//    @Mock
//    UserService userService;

//    @Mock
//    UserRepository userRepository;

    @LocalServerPort
    private int port;

    protected String base;
    protected TestRestTemplate template;

    @Before
    public void setUp() throws Exception {
        base = "http://localhost:" + port + "/";
        template = new TestRestTemplate();
    }
}