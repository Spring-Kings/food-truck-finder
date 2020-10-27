package food.truck.api.endpoint;

import food.truck.api.routes.Route;
import food.truck.api.truck.Truck;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class TruckEndpointTest extends EndpointTest {
    @Test
    public void getTruck() {
        guestClient.get()
                .uri("/truck/{id}", data.testTruckA.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody(Truck.class);
    }

    @Test
    public void createTruck() {
        Truck result = ownerAClient.post()
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
    public void createTruckAsStandardUserFail() {
        standardUserClient.post()
                .uri("/truck/create")
                .bodyValue(new TruckEndpoint.CreateTruckParams("truck1"))
                .exchange()
                .expectStatus().is4xxClientError();
        assertTrue(truckService.findTruck("truck1").isEmpty());
    }

    @Test
    public void deleteTruck() {
        ownerAClient.delete()
                .uri("/truck/delete/{id}", data.testTruckA.getId())
                .exchange()
                .expectStatus().isOk();

        assertEquals(0, truckService.findTruck(data.testTruckA.getName()).size());
    }

    @Test
    public void deleteTruckStandardUserFail() {
        standardUserClient.delete()
                .uri("/truck/delete/{id}", data.testTruckA.getId())
                .exchange()
                .expectStatus().is4xxClientError();
        assertEquals(1, truckService.findTruck(data.testTruckA.getName()).size());
    }

    @Test
    public void deleteDifferentOwnersTruckFail() {
        ownerBClient.delete()
                .uri("/truck/delete/{id}", data.testTruckA.getId())
                .exchange()
                .expectStatus().is4xxClientError();
        assertEquals(1, truckService.findTruck(data.testTruckA.getName()).size());
    }

    @Test
    public void getOwnTruck() {
        ownerAClient.get()
                .uri("/truck/owner")
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Truck.class).contains(data.testTruckA);
    }

    @Test
    public void getOwnTruckStandardUserFail() {
        standardUserClient.get()
                .uri("/truck/owner")
                .exchange()
                .expectStatus().is4xxClientError();
    }

    @Test
    public void updateTruck() {
        var result = ownerAClient.put()
                .uri("/truck/update")
                .bodyValue(new TruckEndpoint.UpdateTruckParams(data.testTruckA.getId(), "truck1337", "a cool truck",
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
    public void updateOtherOwnersTruckFail() {
        ownerBClient.put()
                .uri("/truck/update")
                .bodyValue(new TruckEndpoint.UpdateTruckParams(data.testTruckA.getId(), "truck1337", "a cool truck",
                        3L, null, null, null, null))
                .exchange()
                .expectStatus().is4xxClientError();
    }

    @Test
    public void getRoutes() {
        guestClient.get()
                .uri("/truck/{id}/routes", data.testTruckA.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Route.class).contains(data.testRouteA);
    }

    @Test
    public void getRoutesBadId() {
        guestClient.get()
                .uri("/truck/{id}/routes", 83579233)
                .exchange()
                .expectStatus().is4xxClientError();
    }

    @Test
    public void deleteRoute() {
        ownerAClient.delete()
                .uri("/truck/routes-delete/{rId}", data.testRouteA.getRouteId())
                .exchange()
                .expectStatus().isOk();
        assertTrue(routeService.findRouteById(data.testRouteA.getRouteId()).isEmpty());
    }

    @Test
    public void deleteOtherOwnersRouteFail() {
        ownerBClient.delete()
                .uri("/truck/routes-delete/{rId}", data.testRouteA.getRouteId())
                .exchange()
                .expectStatus().is4xxClientError();
        assertTrue(routeService.findRouteById(data.testRouteA.getRouteId()).isPresent());
    }

    @Test
    public void updateRoute() {
        ownerAClient.put()
                .uri("/truck/{tId}/update-route", data.testTruckA.getId())
                .bodyValue(new TruckEndpoint.UpdateRouteParams(data.testRouteA.getRouteId(), Optional.of("newName"), Optional.empty()))
                .exchange()
                .expectStatus().isOk();
        data.flushAllChanges();
        var r = routeService.findRouteById(data.testRouteA.getRouteId());
        assertTrue(r.isPresent());
        assertEquals("newName", r.get().getRouteName());
        assertEquals(data.testRouteA.isActive(), r.get().isActive());
    }

}
