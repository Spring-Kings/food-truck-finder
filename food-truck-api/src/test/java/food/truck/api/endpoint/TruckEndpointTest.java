package food.truck.api.endpoint;

import food.truck.api.routes.Route;
import food.truck.api.truck.Truck;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TruckEndpointTest extends EndpointTest {
    @Test
    public void getTruck() throws Exception {
        var req = get("/truck/{id}", data.testTruckA.getId());
        var strResponse = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        var truck = fromJson(strResponse, Truck.class);
        assertNotNull(truck);
    }

    @Test
    public void createTruck() throws Exception {
        var req = post("/truck/create")
                .content(asJson(new TruckEndpoint.CreateTruckParams("truck123")))
                .contentType("application/json")
                .with(user(data.ownerA));
        var strResp = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        Truck result = fromJson(strResp, Truck.class);

        assertNotNull(result);
        assertEquals(result.getName(), "truck123");
    }

    @Test
    public void createTruckAsStandardUserFail() throws Exception {
        var req = post("/truck/create")
                .content(asJson(new TruckEndpoint.CreateTruckParams("truck123")))
                .contentType("application/json")
                .with(user(data.standardUser));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError());

        assertTrue(truckService.findTruck("truck123").isEmpty());
    }

    @Test
    public void deleteTruck() throws Exception {
        var req = delete("/truck/delete/{id}", data.testTruckA.getId())
                .with(user(data.ownerA));
        mockMvc.perform(req)
                .andExpect(status().isOk());

        assertEquals(0, truckService.findTruck(data.testTruckA.getName()).size());
    }

    @Test
    public void deleteTruckStandardUserFail() throws Exception {
        var req = delete("/truck/delete/{id}", data.testTruckA.getId())
                .with(user(data.standardUser));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError());
        assertEquals(1, truckService.findTruck(data.testTruckA.getName()).size());
    }

    @Test
    public void deleteDifferentOwnersTruckFail() throws Exception {
        var req = delete("/truck/delete/{id}", data.testTruckA.getId())
                .with(user(data.ownerB));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError());
        assertEquals(1, truckService.findTruck(data.testTruckA.getName()).size());
    }

    @Test
    public void getOwnTruck() throws Exception {
        var req = get("/truck/owner")
                .with(user(data.ownerA));
        var strResp = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        var trucks = fromJsonList(strResp, Truck.class);
        assertThat(trucks, contains(data.testTruckA));
    }

    @Test
    public void getOwnTruckStandardUserFail() throws Exception {
        var req = get("/truck/owner")
                .with(user(data.standardUser));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void updateTruck() throws Exception {
        var req = put("/truck/update")
                .content(asJson(new TruckEndpoint.UpdateTruckParams(data.testTruckA.getId(), "truck1337", "a cool truck",
                        3L, null, null, null, null)))
                .contentType("application/json")
                .with(user(data.ownerA));
        String resp = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        Truck t = fromJson(resp, Truck.class);
        assertEquals("truck1337", t.getName());
        assertEquals("a cool truck", t.getDescription());
        assertEquals(3L, t.getPriceRating());
        assertNull(t.getFoodCategory());
        assertNull(t.getMenu());
        assertNull(t.getTextMenu());
        assertNull(t.getSchedule());

        var truck = truckService.findTruck("truck1337").get(0);
        assertEquals(truck, t);
    }

    @Test
    public void updateOtherOwnersTruckFail() throws Exception {
        var req = put("/truck/update")
                .content(asJson(new TruckEndpoint.UpdateTruckParams(data.testTruckA.getId(), "truck1337", "a cool truck",
                        3L, null, null, null, null)))
                .contentType("application/json")
                .with(user(data.ownerB));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Transactional
    public void getRoutes() throws Exception {
        var req = get("/truck/{id}/routes", data.testTruckA.getId());
        String resp = mockMvc.perform(req)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        var list = fromJsonList(resp, Route.class);
        assertThat(list, contains(data.testRouteA));
    }

    @Test
    public void getRoutesBadId() throws Exception {
        var req = get("/truck/{id}/routes", 83579233);
        mockMvc.perform(req).andExpect(status().is4xxClientError());
    }

    @Test
    public void deleteRoute() throws Exception {
        var req = delete("/truck/routes-delete/{rId}", data.testRouteA.getRouteId())
                .with(user(data.ownerA));
        mockMvc.perform(req)
                .andExpect(status().isOk());
        assertTrue(routeService.findRouteById(data.testRouteA.getRouteId()).isEmpty());
    }

    @Test
    public void deleteOtherOwnersRouteFail() throws Exception {
        var req = delete("/truck/routes-delete/{rId}", data.testRouteA.getRouteId())
                .with(user(data.ownerB));
        mockMvc.perform(req)
                .andExpect(status().is4xxClientError());
        assertTrue(routeService.findRouteById(data.testRouteA.getRouteId()).isPresent());
    }

    @Test
    public void updateRoute() throws Exception {
        var req = put("/truck/{tId}/update-route", data.testTruckA.getId())
                .content(asJson(new TruckEndpoint.UpdateRouteParams(data.testRouteA.getRouteId(), "newName", null)))
                .contentType("application/json")
                .with(user(data.ownerA));
        mockMvc.perform(req)
                .andExpect(status().isOk());
        var r = routeService.findRouteById(data.testRouteA.getRouteId());
        assertTrue(r.isPresent());
        assertEquals("newName", r.get().getRouteName());
        assertEquals(data.testRouteA.isActive(), r.get().isActive());
    }

}