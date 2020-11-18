package food.truck.api.recommendation;

import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;



public class ScoringRecommendationStrategy implements TruckRecommendationStrategy {
    private final TruckService truckSvc;
    private final SubscriptionService subscriptionService;
    private final User user;
    private final UserPreferences prefs;

    public ScoringRecommendationStrategy(TruckService truckSvc, SubscriptionService subscriptionService, User user, UserPreferences prefs) {
        this.truckSvc = truckSvc;
        this.subscriptionService = subscriptionService;
        this.user = user;
        this.prefs = prefs;
    }

    @Override
    public List<Pair<Truck, Double>> selectTrucks() {
        var userSubs = subscriptionService.findSubsByUser(user);

        var trucks = truckSvc.getTrucksCloseToLocation(user.getPosition(), prefs.getAcceptableRadius());
        var result = new ArrayList<Pair<Truck, Double>>();
        for (var truck : trucks) {
            // I think this .get() is okay because .getTrucksCloseToLocation already filtered it to trucks with a valid current location
            var truckLocation = truckSvc.getCurrentRouteLocation(truck.getId()).get().getPosition();
            double distRatio = user.getPosition().distanceInMiles(truckLocation) / prefs.getAcceptableRadius();
            double distScore = ScoreWeights.DistWeight.val * (1 - distRatio);

            double priceScore;
            if (truck.getPriceRating() != null && truck.getPriceRating() > prefs.getPriceRating())
                priceScore = -ScoreWeights.PriceWeight.val * (truck.getPriceRating() - prefs.getPriceRating());
            else
                priceScore = 0;

            double tagScore;
            if (prefs.getTags().size() != 0) {
                int numMatchingTags = 0;
                for (String tag : prefs.getTags()) {
                    if (truck.hasTag(tag))
                        ++numMatchingTags;
                }
                tagScore = ScoreWeights.TagWeight.val * ((double) (numMatchingTags) / prefs.getTags().size());
            } else {
                tagScore = 0;
            }

            double ratingScore;
            if (truck.getStarRating() != null) {
                ratingScore = ScoreWeights.RatingWeight.val * (truck.getStarRating() - 3);
            } else {
                ratingScore = 0;
            }

            double subScore = 0;
            if (userSubs.stream().anyMatch(sub -> sub.getTruck().getId().equals(truck.getId())))
                subScore = ScoreWeights.SubscriptionWeight.val;
            else if (userSubs.stream().anyMatch(sub -> sub.getTruck().getUserId().equals(truck.getUserId())))
                subScore = ScoreWeights.SubscibedToDifferentTruckWithSameOwnerWeight.val;

            result.add(Pair.of(truck, distScore + priceScore + tagScore + ratingScore + subScore));
        }

        result.sort((a, b) -> b.getSecond().compareTo(a.getSecond()));
        return result;
    }
}
