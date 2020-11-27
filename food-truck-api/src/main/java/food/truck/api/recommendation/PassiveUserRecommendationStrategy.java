package food.truck.api.recommendation;

import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;

import java.util.List;

public class PassiveUserRecommendationStrategy implements TruckRecommendationStrategy{
    PassiveUserRecommendationStrategy(TruckService truckSvc, SubscriptionService subscriptionService, User user, UserPreferences prefs){

    }

    @Override
    public List<Truck> selectTrucks() {
        return null;
    }
}
