package food.truck.api.recommendation;

import food.truck.api.Position;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;

import java.util.HashMap;
import java.util.List;

public class GuestRecommendationStrategy implements TruckRecommendationStrategy {
    private final TruckService truckSvc;
    private final Position position;

    public GuestRecommendationStrategy(TruckService truckSvc, Position position) {
        this.truckSvc = truckSvc;
        this.position = position;
    }

    @Override
    public List<Truck> selectTrucks() {
        var RADIUS = 30;
        var trucks = truckSvc.getTrucksCloseToLocation(position, RADIUS);
        var scores = new HashMap<Truck, Double>();
        for (var truck : trucks) {
            // I think this .get() is okay because .getTrucksCloseToLocation already filtered it to trucks with a valid current location
            var truckLocation = truckSvc.getCurrentRouteLocation(truck.getId()).get().getPosition();
            double distRatio = position.distanceInMiles(truckLocation) / RADIUS;
            double distScore = ScoreWeights.DistWeight.val * (1 - distRatio);
            double priceScore = truck.getPriceRating();
            double ratingScore = ScoreWeights.RatingWeight.val * (truck.getStarRating() - 3);

            scores.put(truck, distScore + priceScore + ratingScore);
        }

        trucks.sort((a, b) -> Double.compare(scores.get(b), scores.get(a)));
        return trucks;
    }
}
