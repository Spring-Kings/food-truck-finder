package food.truck.api.endpoint;

import food.truck.api.routes.Route;
import food.truck.api.truck.Truck;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TruckEndpointTest extends EndpointTest {
    @Test
    public void getTruck() {
        guestClient.get()
                .uri("/truck/{id}", testTruck.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(Truck.class);
    }

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

    // TODO: Deny or promote to truck owner?
    @Test
    public void createTruckAsStandardUser() {
        standardUserClient.post()
                .uri("/truck/create")
                .bodyValue(new TruckEndpoint.CreateTruckParams("truck1"))
                .exchange()
                .expectStatus().isForbidden();
        assertTrue(truckService.findTruck("truck1").isEmpty());
    }

    @Test
    public void deleteTruck() {
        ownerClient.delete()
                .uri("/truck/delete/{id}", testTruck.getId())
                .exchange()
                .expectStatus().isOk();

        assertEquals(0, truckService.findTruck(testTruck.getName()).size());
    }

    @Test
    public void deleteTruckUnowned() {
        standardUserClient.delete()
                .uri("/truck/delete/{id}", testTruck.getId())
                .exchange()
                .expectStatus().isForbidden();
        assertEquals(1, truckService.findTruck(testTruck.getName()).size());
    }

    @Test
    public void getOwnTruck() {
        ownerClient.get()
                .uri("/truck/owner")
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Truck.class).contains(testTruck);
    }

    @Test
    public void getOwnTruckStandardUser() {
        standardUserClient.get()
                .uri("/truck/owner")
                .exchange()
                .expectStatus().isForbidden();
    }

    @Test
    public void updateTruck() {
        var result = ownerClient.put()
                .uri("/truck/update")
                .bodyValue(new TruckEndpoint.UpdateTruckParams(testTruck.getId(), "truck1337", "a cool truck",
                        3L, null, null, null, null))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Truck.class)
                .returnResult().getResponseBody();
        assertEquals(result.getName(), "truck1337");
        assertEquals(result.getDescription(), "a cool truck");
        assertEquals(result.getPriceRating(), 3L);
        assertNull(result.getFoodCategory());
        assertNull(result.getMenu());
        assertNull(result.getTextMenu());
        assertNull(result.getSchedule());

        var truck = truckService.findTruck("truck1337").get(0);
        assertEquals(truck, result);
    }

    @Test
    public void updateTruckUnowned() {
        standardUserClient.put()
                .uri("/truck/update")
                .bodyValue(new TruckEndpoint.UpdateTruckParams(testTruck.getId(), "truck1337", "a cool truck",
                        3L, null, null, null, null))
                .exchange()
                .expectStatus().isForbidden();
    }

    @Test
    public void getRoutes() {
        guestClient.get()
                .uri("/truck/{id}/routes", testTruck.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Route.class).contains(testRoute);
    }

}
