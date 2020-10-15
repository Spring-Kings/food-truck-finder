package food.truck.api.endpoint;

import food.truck.api.routes.RouteDays;
import food.truck.api.routes.RouteService;
import food.truck.api.user.User;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
public class RouteEndpoint {
    @Autowired
    private RouteService routeService;

    @GetMapping("/route/{routeId}/days")
    public List<RouteDays> getRouteDays(@AuthenticationPrincipal User u, @PathVariable long routeId){
        return routeService.findRouteDaysbyRouteId(routeId);
    }

    @Value
    private static class PostRouteDaysParams{
        long routeId;
        String day_name;
    }

    @PostMapping("/route/create-days")
    public RouteDays createRouteDays(@AuthenticationPrincipal User u,@RequestBody PostRouteDaysParams rd){
        return routeService.createRouteDays(rd.routeId, RouteDays.Days.valueOf(rd.day_name));
    }
}
