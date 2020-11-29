package food.truck.api.recommendation;

import food.truck.api.Position;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.UserPreferences;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class PassiveGuestRecommendationStrategy implements TruckRecommendationStrategy {

    private final TruckService truckSvc;
    private final Position position;
    private final UserPreferences prefs;
    PassiveGuestRecommendationStrategy(TruckService truckSvc, Position position, UserPreferences prefs){
        this.truckSvc = truckSvc;
        this.position = position;
        this.prefs = prefs;
    }

    @Override
    public List<Pair<Truck, Double>> selectTrucks() {
        int RADIUS = 30;
        var trucks = truckSvc.getTrucksCloseToLocation(position, RADIUS);
        var result = new ArrayList<Pair<Truck, Double>>();
        HashMap<String, Double> tags = new HashMap<>();

        trucks.stream().forEach(t -> {
            if(prefs.getTags().contains(t.getId() + "")) {
                t.getTags().stream().forEach(tag -> {
                    if (tags.containsKey(tag)) {
                        tags.replace(tag, tags.get(tag) + 1.0);
                    } else {
                        tags.put(tag, 1.0);
                    }
                });
            }
        });

        Double value;
        for(Truck t : trucks) {
            value = 0.0;
            for (String tag : t.getTags()) {
                if (tags.containsKey(tag)) {
                    value += tags.get(tag);
                }
            }

            if(prefs.getTags().contains(t.getId() + "")){
                value += 1.0;
            }
            result.add(Pair.of(t, value));
        }

        result.sort((a, b) -> b.getSecond().compareTo(a.getSecond()));

        return result;
    }
}
