package food.truck.api.recommendation;

import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import food.truck.api.user.UserPreferences;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class PassiveUserRecommendationStrategy implements TruckRecommendationStrategy{
    private final TruckService truckSvc;
    private final SubscriptionService subscriptionService;
    private final User user;
    private final UserPreferences prefs;

    PassiveUserRecommendationStrategy(TruckService truckSvc, SubscriptionService subscriptionService, User user, UserPreferences prefs){
        this.truckSvc = truckSvc;
        this.subscriptionService = subscriptionService;
        this.user = user;
        this.prefs = prefs;
    }

    @Override
    public List<Pair<Truck, Double>> selectTrucks() {

        int RADIUS = 30;
        List<Subscription> userSubs = subscriptionService.findSubsByUser(user);
        List<Truck> trucks = truckSvc.getTrucksCloseToLocation(user.getPosition(), RADIUS);

        Double max = 0.0;
        HashMap<String, Double> tags = new HashMap<>();
        var result = new ArrayList<Pair<Truck, Double>>();

        userSubs.stream().forEach(s -> {
            s.getTruck().getTags().stream().forEach(t -> {
                if(tags.containsKey(t)){
                    tags.replace(t, tags.get(t) + 1.0);
                }else{
                    tags.put(t, 1.0);
                }
            });
        });

        for(Double d : tags.values()){
            if(d > max){
                max = d;
            }
        }

        max--;
        Double value;
        for(Truck t : trucks) {
            value = 0.0;
            for (String tag : t.getTags()) {
                if (tags.containsKey(tag)) {
                    value += tags.get(tag);
                }
            }

            if(prefs.getTags().contains(t.getId() + "")){
                value += max + 1.0;
            }
            result.add(Pair.of(t, value));
        }

        result.sort((a, b) -> b.getSecond().compareTo(a.getSecond()));

        return result;
    }
}
