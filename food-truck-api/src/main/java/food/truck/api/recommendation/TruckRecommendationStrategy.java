package food.truck.api.recommendation;

import food.truck.api.truck.Truck;

import java.time.LocalDateTime;
import java.util.List;

public interface TruckRecommendationStrategy {
    List<Truck> selectTrucks(LocalDateTime now);
}
