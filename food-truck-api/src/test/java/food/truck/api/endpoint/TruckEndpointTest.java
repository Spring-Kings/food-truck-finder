package food.truck.api.endpoint;

import food.truck.api.FoodTruckApplication;
import food.truck.api.truck.Truck;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class TruckEndpointTest extends AuthenticationEndpointTest {
    @Test
    public void test() {
        register();
        loginSuccess();
//        String path = base + "truck/create";
//        var data = new TruckEndpoint.CreateTruckParams("truck1");
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", token);
//        HttpEntity<TruckEndpoint.CreateTruckParams> request = new HttpEntity<>(data, headers);
//        var response = template.postForEntity(path, request, Truck.class);
//        System.out.println(response);
    }
}
