package food.truck.api.recommendation.semantic_similarity;

import food.truck.api.truck.Truck;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@Data
public class SimilarityTruck {
    Long truckID;
    Set<String> tags;

    public static final List<SimilarityTruck> toSimilarityTrucks(Collection<Truck> trucks) {
        return trucks.parallelStream().map(t -> new SimilarityTruck(t.getId(), t.getTags())).collect(Collectors.toList());
    }
}
