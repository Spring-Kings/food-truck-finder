package food.truck.api.recommendation.semantic_similarity;

import food.truck.api.truck.Truck;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Log4j2
public class FoodTruckDictionary {

    private static final String SIMILARITY_URL = System.getenv("SIMILARITY_URL");

    /**
     * Compute the similarities for each truck,
     * @param baseScore The base score to assume
     * @param trucks The trucks to get matches for
     * @param searchTags The search tags to grade against
     * @return A map of (truckID, score) pairs, or null if the server could not be accessed.
     */
    public Map<Long, Double> getSimilarityScore(Double baseScore, Collection<Truck> trucks, Collection<String> searchTags) {
        var similarities = getSimilarities(trucks, searchTags);
        if (similarities != null)
            similarities.entrySet().parallelStream().forEach(kv -> kv.setValue(kv.getValue() * baseScore));
        return similarities;
    }

    private Map<Long, Double> getSimilarities(Collection<Truck> trucks, Collection<String> searchTags) {
        // Create input data
        LinkedMultiValueMap body = new LinkedMultiValueMap();
        body.put("trucks", List.copyOf(trucks));
        body.put("search_tags", List.copyOf(searchTags));

        // Make request
        try {
            // I KNOW WHAT I'M DOING! HONEST!
            @SuppressWarnings("unchecked")
            var result = (Map<Long, Double>) WebClient.create()
                    .post()
                    .uri(URI.create(SIMILARITY_URL + "/compare"))
                    .body(BodyInserters.fromMultipartData(body))
                    .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
                    .acceptCharset(StandardCharsets.UTF_8)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            for (var kv : result.entrySet())
                System.out.println(kv.getKey() + ": " + kv.getValue());
            return result;
        } catch (Exception ex) {
            log.error("Failure occurred contacting similarity service", ex);
            return null;
        }
    }
}
