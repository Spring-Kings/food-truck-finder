package food.truck.api.truck;

import food.truck.api.routes.RouteLocation;
import lombok.Data;

@Data
public class RecommendedTruck {
    Truck truck;
    RouteLocation loc;
    Double score;
}
