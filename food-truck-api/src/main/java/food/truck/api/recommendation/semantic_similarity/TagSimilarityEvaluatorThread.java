package food.truck.api.recommendation.semantic_similarity;

import food.truck.api.truck.Truck;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Provides a secondary thread to compute tag scores for all trucks
 */
public class TagSimilarityEvaluatorThread extends Thread {

    /** All similarity scores, in (TruckId,Score) pairs */
    private Map<Long, Double> scores = null;

    /** Dictionary used to run the scoring */
    private final TagSimilarityEvaluator evaluator;

    /** All nearby trucks, as provided by caller */
    private final List<SimilarityTruck> nearbyTrucks;

    /** Searched tags */
    private final Set<String> tags;

    /** The score weighting for this category */
    private final Double score;

    public TagSimilarityEvaluatorThread(TagSimilarityEvaluator evaluator, List<Truck> trucks, Set<String> tags, double score) {
        this.nearbyTrucks = SimilarityTruck.toSimilarityTrucks(trucks);
        this.tags = tags;
        this.score = score;
        this.evaluator = evaluator;
    }

    @Override
    public void run() {
        // Shortcut: if no tags, don't waste our time.
        if (tags.size() == 0 || nearbyTrucks.size() == 0)
            return;

        // Compute all scores
        scores = evaluator.getSimilarityScore(score, nearbyTrucks, tags);
    }

    /**
     * Update the provided scores with all scores this thread computed
     * @param finalScores The list of scores to update
     */
    public void populateScores(List<Pair<Truck, Double>> finalScores) {
        // If no scores found, return
        if (scores == null)
            return;

        // Add all scores in
        for (int i = 0; i < finalScores.size(); i++) {
            var kv = finalScores.get(i);
            finalScores.set(i, Pair.of(kv.getFirst(), kv.getSecond() + scores.get(kv.getFirst().getId())));
        }
    }
}
