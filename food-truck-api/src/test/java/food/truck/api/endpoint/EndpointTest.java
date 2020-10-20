package food.truck.api.endpoint;

import food.truck.api.FoodTruckApplication;
import food.truck.api.security.SecurityMethods;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import reactor.core.publisher.Mono;

import java.util.function.Function;

@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@Log4j2
public class EndpointTest {
    @Autowired
    protected UserService userService;

    @LocalServerPort
    private int port;

    protected WebTestClient standardUserClient;
    protected WebTestClient ownerClient;
    protected WebTestClient guestClient;

    protected User owner;
    protected User standardUser;

    @BeforeEach
    public void setup() {
        initDb();

        // Great, a function that returns a function
        Function<User, ExchangeFilterFunction> makeFilterThatAddsTokenFor = (user) -> {
            // The stupid req.headers() function gives an immutable list
            // so use ofRequestProcessor to copy the request and add the auth header
            return ExchangeFilterFunction.ofRequestProcessor(req -> Mono.just(
                    ClientRequest.from(req)
                            .header("Authorization", getToken(user))
                            .build()
            ));
        };

        guestClient = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
        standardUserClient = guestClient.mutate()
                .filter(makeFilterThatAddsTokenFor.apply(standardUser))
                .build();
        ownerClient = guestClient.mutate()
                .filter(makeFilterThatAddsTokenFor.apply(owner))
                .build();
    }

    protected void initDb() {
        standardUser = userService.createUser("standardUser", "password", "aaa@aaa", false);
        owner = userService.createUser("owner", "password", "bbb@bbb", true);
    }

    protected String getToken(User u) {
        return SecurityMethods.makeTokenForUser(u);
    }
}