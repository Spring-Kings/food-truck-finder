package food.truck.api.endpoint;

import food.truck.api.Constants;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Log4j2
@RestController
@CrossOrigin(origins = Constants.FRONTEND_URL)
public class TruckEndpoint {

    @GetMapping("/nearby-trucks")
    public String getNearbyTrucks(@RequestParam String location) {
        return ""; //TODO
    }

    @GetMapping(path = "/recommended-trucks")
    public String getRecommendedTrucks(
            @RequestParam String location,
            @RequestParam Optional<String> username,
            @RequestParam Optional<String> token
    ) {
        return ""; // TODO
    }

    @GetMapping(path = "/truck/{id}")
    public String getTruckInfo(@PathVariable long id) {
        return ""; //TODO
    }
}
