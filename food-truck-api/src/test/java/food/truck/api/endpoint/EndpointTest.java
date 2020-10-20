package food.truck.api.endpoint;

import food.truck.api.FoodTruckApplication;
import food.truck.api.security.SecurityMethods;
import food.truck.api.user.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import reactor.core.publisher.Mono;

import java.util.function.Function;

@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class EndpointTest {
    @Autowired
    protected UserService userService;

    @LocalServerPort
    private int port;

    protected WebTestClient standardUserClient;
    protected WebTestClient ownerClient;
    protected WebTestClient guestClient;

    @BeforeEach
    public void setup() {
        initDb();

        // Great, a function that returns a function
        Function<String, ExchangeFilterFunction> getFilterThatAddsTokenForUsername = (username) -> {
            // The stupid req.headers() function gives an immutable list
            // so use ofRequestProcessor to copy the request and add the auth header
            return ExchangeFilterFunction.ofRequestProcessor(req -> Mono.just(
                    ClientRequest.from(req)
                            .header("Authorization", getToken(username))
                            .build()
            ));
        };

        guestClient = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
        standardUserClient = guestClient.mutate()
                .filter(getFilterThatAddsTokenForUsername.apply("standardUser"))
                .build();
        ownerClient = guestClient.mutate()
                .filter(getFilterThatAddsTokenForUsername.apply("owner"))
                .build();
    }

    protected void initDb() {
        userService.findUserByUsername("standardUser").ifPresent(u -> userService.deleteUser(u.getId()));
        userService.createUser("standardUser", "password", "aaa@aaa", false);
        userService.findUserByUsername("owner").ifPresent(u -> userService.deleteUser(u.getId()));
        userService.createUser("owner", "password", "bbb@bbb", true);
    }


    protected String getToken(String username) {
        var user = userService.findUserByUsername(username);
        Assertions.assertTrue(user.isPresent());
        return SecurityMethods.makeTokenForUser(userService.findUserByUsername(username).get());
    }

    /*
    protected <T> HttpEntity<T> makeEntity(T data) {
        return makeEntity(data, true);
    }
    protected <T> HttpEntity<T> makeEntity(T data, boolean loggedIn) {
        HttpHeaders headers = new HttpHeaders();
        if (loggedIn)
            headers.set("Authorization", getToken());
        return new HttpEntity<>(data, headers);
    }*/


}