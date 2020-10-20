package food.truck.api.endpoint;

import food.truck.api.truck.Truck;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class TruckEndpointTest extends EndpointTest {
    @Test
    public void createTruck() {
        Truck result = ownerClient.post()
                .uri("/truck/create")
                .bodyValue(new TruckEndpoint.CreateTruckParams("truck1"))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Truck.class)
                .returnResult().getResponseBody();

        assertNotNull(result);
        assertEquals(result.getName(), "truck1");
    }
/*
    @Test
    public void deleteTruck() {
        createTruck();
        String path = base + "truck/delete/1";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        var request = new HttpEntity<>("", headers);
        template.exchange(path, HttpMethod.DELETE, request, String.class);
        var response = template.getForEntity(base + "truck/1", Truck.class);
        var truck = response.getBody();
        assertNull(truck);
    }

    @Test
    public void updateTruck() {
        createTruck();
        String path = base + "truck/update";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        var body = new TruckEndpoint.UpdateTruckParams(1, "new name", "desc", (long)5, null, null, null, null);
        var request = new HttpEntity<>(body, headers);
        var response = template.exchange(path, HttpMethod.PUT, request, Truck.class);
        var truck = response.getBody();
        assertNotNull(truck);
        assertEquals(body.getName(), truck.getName());
        assertEquals(body.getDescription(), truck.getDescription());
        assertEquals(body.getPriceRating(), truck.getPriceRating());
        assertNull(truck.getFoodCategory());
        assertNull(truck.getMenu());
        assertNull(truck.getTextMenu());
        assertNull(truck.getSchedule());
    }

    @Test
    public void getTruck() {
        createTruck();
        var response = template.getForEntity(base + "truck/1", Truck.class);
        var truck = response.getBody();
        assertNotNull(truck);
        response = template.getForEntity(base + "truck/2", Truck.class);
        truck = response.getBody();
        assertNull(truck);
    }

 */
}
