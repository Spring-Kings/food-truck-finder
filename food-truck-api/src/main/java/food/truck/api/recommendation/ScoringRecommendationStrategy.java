package food.truck.api.recommendation;

import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;

import java.util.HashMap;
import java.util.List;

enum ScoreWeights {
    DistWeight(1.0),
    PriceWeight(1.0),
    CategoryWeight(1.0),
    MenuWeight(1.0),
    RatingWeight(1.0);

    public final double val;

    ScoreWeights(double val) {
        this.val = val;
    }
}

public class ScoringRecommendationStrategy implements TruckRecommendationStrategy {
    private final TruckService truckSvc;
    private final User user;
    private final UserPreferences prefs;

    public ScoringRecommendationStrategy(TruckService truckSvc, User user, UserPreferences prefs) {
        this.truckSvc = truckSvc;
        this.user = user;
        this.prefs = prefs;
    }

    @Override
    public List<Truck> selectTrucks() {
        var trucks = truckSvc.getTrucksCloseToLocation(user.getPosition(), prefs.getAcceptableRadius());
        var scores = new HashMap<Truck, Double>();
        for (var truck : trucks) {
            // I think this .get() is okay because .getTrucksCloseToLocation already filtered it to trucks with a valid current location
            var truckLocation = truckSvc.getCurrentRouteLocation(truck.getId()).get().getPosition();
            double distRatio = user.getPosition().distanceInMiles(truckLocation) / prefs.getAcceptableRadius();
            double distScore = ScoreWeights.DistWeight.val * (1 - distRatio);

            double priceScore;
            if (truck.getPriceRating() > prefs.getPriceRating())
                priceScore = -ScoreWeights.PriceWeight.val * (truck.getPriceRating() - prefs.getPriceRating());
            else
                priceScore = 0;

            double categoryScore = truck.getFoodCategory().equals(prefs.getFoodCategory())
                    ? ScoreWeights.CategoryWeight.val : 0;

            double menuScore = 0;
            for (String item : prefs.getMenuItems()) {
                // For now, very simple and error-prone implementation for whether truck has item
                if (truck.getTextMenu().toLowerCase().contains(item.toLowerCase()))
                    menuScore += ScoreWeights.MenuWeight.val;
            }

            // We don't have ratings yet
            double ratingScore = 0.0;
            //double ratingScore = ScoreWeights.RatingWeight.val * (truck.getAverageRating() - 3);

            scores.put(truck, distScore + priceScore + categoryScore + menuScore + ratingScore);
        }

        trucks.sort((a, b) -> Double.compare(scores.get(b), scores.get(a)));
        return trucks;
    }
}
