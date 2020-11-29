package food.truck.api.recommendation;

import food.truck.api.recommendation.semantic_similarity.TagSimilarityEvaluator;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

public class StrategySelector {
    @Autowired
    SubscriptionService subSvc;
    @Autowired
    TruckService truckSvc;
    @Autowired
    TagSimilarityEvaluator evaluator;

    public TruckRecommendationStrategy selectStrategy(AbstractUser u, UserPreferences prefs) {
        if (u instanceof User) {
            return new ScoringRecommendationStrategy(truckSvc, subSvc, (User) u, prefs, evaluator);
        }
        return new GuestRecommendationStrategy(truckSvc, u.getPosition());
    }
}
