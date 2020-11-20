package food.truck.api.recommendation.semantic_similarity;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;
import java.util.function.ToDoubleFunction;

@Log4j2
public class FoodTruckDictionary {

    private static final String SIMILARITY_URL = System.getenv("SIMILARITY_URL");
    private static final Double MIN_FOR_MATCH;
    private static final Double MIN_FOR_SAMETYPE;
    static {
        var similarityThreshhold = System.getenv("EXACT_THRESHHOLD");
        var typeThreshhold = System.getenv("TYPE_THRESHHOLD");
        double threshhold = 0.98d;
        double type = 0.65d;

        // Extract threshhold
        if (similarityThreshhold != null) {
            try {
                threshhold = Double.parseDouble(similarityThreshhold);
                type = Double.parseDouble(typeThreshhold);
            } catch (Exception ex) {
                log.error("Similarity threshhold or type could not be extracted from environment variables!", ex);
            }
        }

        // Set up minimum threshhold for a 'match'
        MIN_FOR_MATCH = threshhold;
        MIN_FOR_SAMETYPE = type;
    }

    public Double getSimilarityScore(Double baseScore, List<String> truckTags, List<String> searchTags) {
        // Get the list; if nothing's returned, return 0
        var simList = getSimilarities(truckTags, searchTags);
        if (simList == null || simList.size() == 0)
            return 0d;

        // Calculate the score for the category
        int score = 0;
        for (Double d : simList) {
            if (d > MIN_FOR_MATCH)
                score += 2;
            else if (d > MIN_FOR_SAMETYPE)
                score += 1;
        }
        return baseScore * ((double) score) / (2 * simList.size());
    }

    public List<Double> getSimilarities(List<String> truckTags, List<String> searchTags) {
        // Create input data
        LinkedMultiValueMap body = new LinkedMultiValueMap();
        body.put("truck_tags", truckTags);
        body.put("search_tags", searchTags);

        // Make request
        try {
            var result = (Map<String, List<Double>>) WebClient.create()
                    .post()
                    .uri(URI.create(SIMILARITY_URL + "/compare"))
                    .body(BodyInserters.fromMultipartData(body))
                    .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
                    .acceptCharset(Charset.forName("UTF-8"))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            return result.get("sim_list");
        } catch (Exception ex) {
            log.error("Failure occurred contacting similarity service", ex);
            return null;
        }
    }
}
