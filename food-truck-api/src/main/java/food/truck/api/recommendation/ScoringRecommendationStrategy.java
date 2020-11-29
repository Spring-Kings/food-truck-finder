package food.truck.api.recommendation;

import food.truck.api.recommendation.semantic_similarity.TagSimilarityEvaluator;
import food.truck.api.recommendation.semantic_similarity.TagSimilarityEvaluatorThread;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
public class ScoringRecommendationStrategy implements TruckRecommendationStrategy {
    private final TruckService truckSvc;
    private final SubscriptionService subscriptionService;
    private final User user;
    private final UserPreferences prefs;
    private final TagSimilarityEvaluator evaluator;

    @Override
    public List<Pair<Truck, Double>> selectTrucks() {
        var userSubs = subscriptionService.findSubsByUser(user);

        var trucks = truckSvc.getTrucksCloseToLocation(user.getPosition(), prefs.getAcceptableRadius());

        // Run a secondary thread to acquire all truck tags
        var getTagThread = new TagSimilarityEvaluatorThread(evaluator, trucks, prefs.getTags(), ScoreWeights.TagWeight.val);
        getTagThread.start();

        // Compute the rest of the scores
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

            result.add(Pair.of(truck, distScore + priceScore + ratingScore + subScore));
        }

        // Rejoin the two score computations
        try {
            getTagThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        getTagThread.populateScores(result);

        result.sort((a, b) -> b.getSecond().compareTo(a.getSecond()));
        return result;
    }
}
