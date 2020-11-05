package food.truck.api.recommendation;

import food.truck.api.truck.TruckService;
import food.truck.api.user.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

public class StrategySelector implements UserVisitor {
    @Setter
    private TruckService truckSvc;

    @Setter
    private UserPreferences userPreferences;

    @Getter
    private TruckRecommendationStrategy recommendationStrategy;

    public void accept(User u) {
        recommendationStrategy = new ScoringRecommendationStrategy(truckSvc, u, userPreferences);
    }

    public void accept(Guest g) {
        recommendationStrategy = null;
    }

    public void accept(AbstractUser u) {
        recommendationStrategy = null;
    }
}
