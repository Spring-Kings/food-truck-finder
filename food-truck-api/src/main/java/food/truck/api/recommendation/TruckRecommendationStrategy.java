package food.truck.api.recommendation;

import food.truck.api.truck.Truck;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.stream.Collectors;

public interface TruckRecommendationStrategy {
    List<Pair<Truck, Double>> selectTrucks();

    default List<Pair<Truck, Double>> getTrucksWithNormalizedScores() {
        var trucksScores = selectTrucks();
        if (trucksScores.isEmpty())
            return trucksScores;

        var stats = trucksScores.stream().mapToDouble(Pair::getSecond).summaryStatistics();
        return trucksScores.stream()
                .map(pair -> {
                    var truck = pair.getFirst();
                    double score = pair.getSecond();
                    double normalizedScore = (score + stats.getMin()) * (100.0 / (stats.getMax() + stats.getMin()));
                    return Pair.of(truck, normalizedScore);
                })
                .collect(Collectors.toList());
    }
}
