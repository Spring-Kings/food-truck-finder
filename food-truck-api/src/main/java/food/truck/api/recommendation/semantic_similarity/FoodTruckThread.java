package food.truck.api.recommendation.semantic_similarity;

import food.truck.api.truck.Truck;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Provides a secondary thread to compute tag scores for all trucks
 */
@RequiredArgsConstructor
public class FoodTruckThread extends Thread {

    /** All similarity scores, in (TruckId,Score) pairs */
    private Map<Long, Double> scores = null;

    /** Dictionary used to run the scoring */
    private final FoodTruckDictionary dict;

    /** All nearby trucks, as provided by caller */
    private final List<Truck> nearbyTrucks;

    /** Searched tags */
    private final Set<String> tags;

    /** The score weighting for this category */
    private final Double score;

    @Override
    public void run() {
        // Shortcut: if no tags, don't waste our time.
        if (tags.size() == 0 || nearbyTrucks.size() == 0)
            return;

        // Compute all scores
        scores = dict.getSimilarityScore(score, nearbyTrucks, tags);
    }

    /**
     * Update the provided map with all scores this thread computed
     * @param final_scores The map of scores to update
     */
    public void populateScores(Map<Truck, Double> final_scores) {
        // If no scores found, return
        if (scores == null)
            return;

        // Add all scores in
        for (var kv : final_scores.entrySet())
            kv.setValue(kv.getValue() + scores.get(kv.getKey().getId()));
    }
}
