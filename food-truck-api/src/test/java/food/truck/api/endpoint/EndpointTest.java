package food.truck.api.endpoint;

import food.truck.api.FoodTruckApplication;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteService;
import food.truck.api.security.SecurityMethods;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
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

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.function.Function;

@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Log4j2
public class EndpointTest {
    @Autowired
    protected UserService userService;
    @Autowired
    protected TruckService truckService;
    @Autowired
    protected RouteService routeService;
    @Autowired
    private DataSource dataSource;
    @LocalServerPort
    private int port;


    protected WebTestClient standardUserClient;
    protected WebTestClient ownerClient;
    protected WebTestClient guestClient;

    protected User owner;
    protected User standardUser;
    protected Truck testTruck;
    protected Route testRoute;

    @BeforeEach
    public void setup() {
        initDb();

        // Great, a function that returns a function
        Function<User, ExchangeFilterFunction> makeFilterThatAddsTokenFor = (user) -> {
            // The stupid req.headers() function gives an immutable list
            // so use ofRequestProcessor to copy the request and add the auth header
            return ExchangeFilterFunction.ofRequestProcessor(req -> Mono.just(
                    ClientRequest.from(req)
                            .header("Authorization", SecurityMethods.makeTokenForUser(user))
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
        testTruck = truckService.createTruck(owner.getId(), "testTruck");
        testRoute = routeService.createRoute(testTruck, "testRoute", 'Y');
    }

    @AfterEach
    public void cleanup() throws SQLException {
        dataSource.getConnection().prepareStatement(
                "DELETE FROM route_days; DELETE FROM route_location; DELETE FROM route;" +
                        "DELETE FROM review; DELETE FROM subscription; DELETE FROM truck; DELETE FROM user;"
        ).execute();
    }
}