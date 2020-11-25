package food.truck.api.recommendation.semantic_similarity;

import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
public class FoodTruckDictionary {

    private static final String SIMILARITY_URL = System.getenv("SIMILARITY_URL");

    @Value
    public static class SimilarityRequest {
        Collection<String> tags;
        Collection<SimilarityTruck> trucks;
    }

    /**
     * Compute the similarities for each truck,
     * @param baseScore The base score to assume
     * @param trucks The trucks to get matches for
     * @param searchTags The search tags to grade against
     * @return A map of (truckID, score) pairs, or null if the server could not be accessed.
     */
    public Map<Long, Double> getSimilarityScore(Double baseScore, Collection<SimilarityTruck> trucks, Collection<String> searchTags) {
        var similarities = getSimilarities(trucks, searchTags);
        if (similarities != null)
            similarities.entrySet().parallelStream().forEach(kv -> kv.setValue(kv.getValue() * baseScore));
        return similarities;
    }

    private Map<Long, Double> getSimilarities(Collection<SimilarityTruck> trucks, Collection<String> searchTags) {
        // Create input data
        var body = new SimilarityRequest(searchTags, trucks);

        // Make request
        try {
            // Learned setting content type: https://stackoverflow.com/questions/55451598/spring-webflux-webclient-content-type-headers-set-issue
            @NonNull var response = WebClient.create()
                    .post()
                    .uri(URI.create(SIMILARITY_URL + "/compare"))
                    .header("Content-Type", "application/json")
                    .body(BodyInserters.fromValue(body))
                    .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
                    .acceptCharset(StandardCharsets.UTF_8)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Translate map from the weird format I receive it back in to have Longs as keys
            @SuppressWarnings("unchecked")
            var result = ((Map<String, Double>) response.get("similarity_scores"))
                    .entrySet()
                    .parallelStream()
                    .collect(Collectors.toMap(k -> Long.parseLong(k.getKey()),
                            Map.Entry::getValue));
            return result;
        } catch (Exception ex) {
            log.error("Failure occurred contacting similarity service", ex);
            return null;
        }
    }
}
