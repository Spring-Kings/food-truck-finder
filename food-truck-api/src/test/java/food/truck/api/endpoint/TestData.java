package food.truck.api.endpoint;

import food.truck.api.reviews_and_subscriptions.ReviewRepository;
import food.truck.api.reviews_and_subscriptions.SubscriptionRepository;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocationRepository;
import food.truck.api.routes.RouteRepository;
import food.truck.api.routes.RouteService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckRepository;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserRepository;
import food.truck.api.user.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.Instant;
import java.time.LocalDateTime;

@Log4j2
@Profile({"test", "dev"})
@Component
public class TestData {
    @Autowired
    protected UserService userService;
    @Autowired
    protected TruckService truckService;
    @Autowired
    protected RouteService routeService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private RouteLocationRepository routeLocationRepository;
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private TruckRepository truckRepository;

    public User ownerA;
    public Truck testTruckA;
    public Route testRouteA;

    public User ownerB;
    public Truck testTruckB;

    public User standardUser;

    @PostConstruct
    public void loadTestData() {
        log.info("Creating test data");

        standardUser = userService.createUser("standardUser", "password", "aaa@aaa", false);

        ownerA = userService.createUser("owner", "password", "bbb@bbb", true);
        testTruckA = truckService.createTruck(ownerA.getId(), "testTruckA");
        testRouteA = routeService.createRoute(testTruckA, "testRouteA", true);
        routeService.addDayToRoute(testRouteA.getRouteId(), LocalDateTime.now().getDayOfWeek());
        routeService.createLocation(testRouteA.getRouteId(), 1.23, 1.23, Instant.now(), Instant.now().plusSeconds(1000));

        ownerB = userService.createUser("ownerB", "password", "yeetarino", true);
        testTruckB = truckService.createTruck(ownerB.getId(), "testTruckB");

        reloadFromDb();

        log.info("Done creating test data");
    }

    public void reloadFromDb() {
        standardUser = userService.findUserById(standardUser.getId()).get();
        ownerA = userService.findUserById(ownerA.getId()).get();
        testTruckA = truckService.findTruckById(testTruckA.getId()).get();
        testRouteA = routeService.findRouteById(testRouteA.getRouteId()).get();
        ownerB = userService.findUserById(ownerB.getId()).get();
        testTruckB = truckService.findTruckById(testTruckB.getId()).get();
    }

}
