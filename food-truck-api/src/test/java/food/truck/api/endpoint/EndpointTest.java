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
import java.time.Instant;
import java.time.LocalDateTime;
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
    protected WebTestClient ownerAClient;
    protected WebTestClient ownerBClient;
    protected WebTestClient guestClient;

    protected User ownerA;
    protected Truck testTruckA;
    protected Route testRouteA;

    protected User ownerB;
    protected Truck testTruckB;

    protected User standardUser;

    @BeforeEach
    public void setup() throws SQLException {
        cleanup(); // Why doesn't it work without this, just with @aftereach?
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
        ownerAClient = guestClient.mutate()
                .filter(makeFilterThatAddsTokenFor.apply(ownerA))
                .build();
        ownerBClient = guestClient.mutate()
                .filter(makeFilterThatAddsTokenFor.apply(ownerB))
                .build();
    }

    protected void initDb() {
        standardUser = userService.createUser("standardUser", "password", "aaa@aaa", false);

        ownerA = userService.createUser("owner", "password", "bbb@bbb", true);
        testTruckA = truckService.createTruck(ownerA.getId(), "testTruckA");
        testRouteA = routeService.createRoute(testTruckA, "testRouteA", true);
        routeService.addDayToRoute(testRouteA.getRouteId(), LocalDateTime.now().getDayOfWeek());
        routeService.createLocation(testRouteA.getRouteId(), 1.23, 1.23, Instant.now(), Instant.now().plusSeconds(1000));
        testRouteA = routeService.findRouteById(testRouteA.getRouteId()).get(); // Save above two changes

        ownerB = userService.createUser("ownerB", "password", "yeetarino", true);
        testTruckB = truckService.createTruck(ownerB.getId(), "testTruckB");
    }

    @AfterEach
    public void cleanup() throws SQLException {
        dataSource.getConnection().prepareStatement(
                "DELETE FROM route_days; DELETE FROM route_location; DELETE FROM route;" +
                        "DELETE FROM review; DELETE FROM subscription; DELETE FROM truck; DELETE FROM user;"
        ).execute();
    }
}