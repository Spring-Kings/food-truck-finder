package food.truck.api.recommendation;

import food.truck.api.Position;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.UserPreferences;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class GuestSearchRecommendationStrategy implements TruckRecommendationStrategy {

    private final TruckService truckSvc;
    private final Position position;
    private final UserPreferences prefs;
    GuestSearchRecommendationStrategy(TruckService truckSvc, Position position, UserPreferences prefs){
        this.truckSvc = truckSvc;
        this.position = position;
        this.prefs = prefs;
    }

    @Override
    public List<Pair<Truck, Double>> selectTrucks() {
        var trucks = truckSvc.getTrucksCloseToLocation(position, prefs.getAcceptableRadius());
        var result = new ArrayList<Pair<Truck, Double>>();
        HashMap<String, Double> tags = new HashMap<>();
        double distRatio, distScore,priceScore, ratingScore;
        Double value;

        trucks.stream().forEach(t -> {
            if(prefs.getTruckIds().contains(t.getId())) {
                t.getTags().stream().forEach(tag -> {
                    if (tags.containsKey(tag)) {
                        tags.replace(tag, tags.get(tag) + 1.0);
                    } else {
                        tags.put(tag, 1.0);
                    }
                });
            }
        });

        prefs.getTags().stream().forEach(tag -> {
            if(tags.containsKey(tag)){
                tags.replace(tag, tags.get(tag) + 1.0);
            } else {
                tags.put(tag, 1.0);
            }
        });

        for(Truck t : trucks) {
            value = 0.0;
            for (String tag : t.getTags()) {
                if (tags.containsKey(tag)) {
                    value += tags.get(tag);
                }
            }

            var truckLocation = truckSvc.getCurrentRouteLocation(t.getId()).get().getPosition();
            distRatio = position.distanceInMiles(truckLocation) / prefs.getAcceptableRadius();
            distScore = ScoreWeights.DistWeight.val * (1 - distRatio);
            priceScore = (t.getPriceRating() != null) ? t.getPriceRating() : 0;
            ratingScore = (t.getStarRating() != null) ? ScoreWeights.RatingWeight.val * (t.getStarRating() - 3) : 0;

            if(prefs.getTruckIds().contains(t.getId())){
                value = (value *1.5) + 2.0;
            }

            value += distScore + priceScore + ratingScore;

            result.add(Pair.of(t, value));
        }

        result.sort((a, b) -> b.getSecond().compareTo(a.getSecond()));

        return result;
    }
}
