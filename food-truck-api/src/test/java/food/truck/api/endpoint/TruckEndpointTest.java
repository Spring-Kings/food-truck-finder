package food.truck.api.endpoint;

import food.truck.api.truck.Truck;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import static org.junit.Assert.*;

public class TruckEndpointTest extends AuthenticationEndpointTest {
    @Test
    public void createTruck() {
        loginSuccess();
        String path = base + "truck/create";
        var data = new TruckEndpoint.CreateTruckParams("truck1");
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        var request = new HttpEntity<>(data, headers);
        var response = template.postForEntity(path, request, Truck.class);
        var truck = response.getBody();
        assertNotNull(truck);
        assertEquals(truck.getName(), "truck1");
    }

    @Test
    public void deleteTruck() {
        createTruck();
        String path = base + "truck/delete/1";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        System.out.println(headers);
        var request = new HttpEntity<>("", headers);
        template.exchange(path, HttpMethod.DELETE, request, String.class);
        var response = template.getForEntity(base + "truck/1", Truck.class);
        var truck = response.getBody();
        assertNull(truck);
    }
}
