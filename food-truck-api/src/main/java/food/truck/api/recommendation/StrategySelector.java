package food.truck.api.recommendation;

import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;

public class StrategySelector {
    private final TruckService truckSvc;
    private final SubscriptionService subSvc;

    public StrategySelector(TruckService truckSvc, SubscriptionService subSvc) {
        this.truckSvc = truckSvc;
        this.subSvc = subSvc;
    }

    public TruckRecommendationStrategy selectStrategy(AbstractUser u, UserPreferences prefs) {
        if (u instanceof User) {
            return new ScoringRecommendationStrategy(truckSvc, subSvc, (User) u, prefs);
        }
        return new GuestRecommendationStrategy(truckSvc, u.getPosition());
    }
}
