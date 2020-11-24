package food.truck.api.recommendation;

import food.truck.api.Position;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;

public class GuestRecommendationStrategy implements TruckRecommendationStrategy {
    private final TruckService truckSvc;
    private final Position position;

    public GuestRecommendationStrategy(TruckService truckSvc, Position position) {
        this.truckSvc = truckSvc;
        this.position = position;
    }

    @Override
    public List<Pair<Truck, Double>> selectTrucks() {
        var RADIUS = 30;
        var trucks = truckSvc.getTrucksCloseToLocation(position, RADIUS);
        var result = new ArrayList<Pair<Truck, Double>>();
        for (var truck : trucks) {
            // I think this .get() is okay because .getTrucksCloseToLocation already filtered it to trucks with a valid current location
            var truckLocation = truckSvc.getCurrentRouteLocation(truck.getId()).get().getPosition();
            double distRatio = position.distanceInMiles(truckLocation) / RADIUS;
            double distScore = ScoreWeights.DistWeight.val * (1 - distRatio);
            double priceScore = (truck.getPriceRating() != null) ? truck.getPriceRating() : 0;
            double ratingScore = (truck.getStarRating() != null) ? ScoreWeights.RatingWeight.val * (truck.getStarRating() - 3) : 0;

            result.add(Pair.of(truck, distScore + priceScore + ratingScore));
        }

        result.sort((a, b) -> b.getSecond().compareTo(a.getSecond()));
        return result;
    }
}
