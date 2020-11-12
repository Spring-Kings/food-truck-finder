package food.truck.api.recommendation;

import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;

public class StrategySelector {
    private final TruckService truckSvc;

    public StrategySelector(TruckService truckSvc) {
        this.truckSvc = truckSvc;
    }

    public TruckRecommendationStrategy selectStrategy(AbstractUser u, UserPreferences prefs) {
        if (u instanceof User) {
            return new ScoringRecommendationStrategy(truckSvc, (User) u, prefs);
        }
        return new GuestRecommendationStrategy(truckSvc, u.getPosition());
    }
}
