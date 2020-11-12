package food.truck.api.recommendation;

import food.truck.api.truck.Truck;

import java.util.List;

public interface TruckRecommendationStrategy {
    List<Truck> selectTrucks();
}
