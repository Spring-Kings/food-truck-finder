package food.truck.api.endpoint;

import food.truck.api.truck.Truck;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

public class TruckEndpointTest extends AuthenticationEndpointTest {
    @Test
    public void test() {
        String path = base + "truck/create";
        var data = new TruckEndpoint.CreateTruckParams("truck1");
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<TruckEndpoint.CreateTruckParams> request = new HttpEntity<>(data, headers);
        var response = template.postForEntity(path, request, Truck.class);
        System.out.println(response);
    }
}
