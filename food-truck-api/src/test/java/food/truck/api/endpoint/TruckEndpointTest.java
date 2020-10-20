package food.truck.api.endpoint;

import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

public class TruckEndpointTest extends EndpointTest {
    @Autowired
    private TruckService truckService;

    private void ensureNoTestTruck() {
        truckService.findTruck("truck1")
                .forEach(t -> truckService.deleteTruck(t.getId()));
    }

    private Truck ensureTestTruck() {
        var list = truckService.findTruck("truck1");
        if (list.size() == 1)
            return list.get(0);
        else
            return truckService.createTruck(owner.getId(), "truck1");
    }

    @Test
    public void createTruck() {
        ensureNoTestTruck();
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

    @Test
    public void deleteTruck() {
        var truck = ensureTestTruck();
        ownerClient.delete()
                .uri("/truck/delete/{id}", truck.getId())
                .exchange()
                .expectStatus().isOk();

        assertEquals(truckService.findTruck("truck1").size(), 0);
    }

    @Test
    public void updateTruck() {
        var truck = ensureTestTruck();
        var result = ownerClient.put()
                .uri("/truck/update")
                .bodyValue(new TruckEndpoint.UpdateTruckParams(truck.getId(), "truck1337", "a cool truck",
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

        truck = truckService.findTruck("truck1337").get(0);
        assertEquals(truck, result);
    }

    @Test
    public void getTruck() {
        var truck = ensureTestTruck();
        guestClient.get()
                .uri("/truck/{id}", truck.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(Truck.class);
    }
}
