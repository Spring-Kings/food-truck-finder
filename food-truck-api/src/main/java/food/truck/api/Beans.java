package food.truck.api;

import food.truck.api.recommendation.StrategySelector;
import food.truck.api.recommendation.semantic_similarity.TagSimilarityEvaluator;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.reactive.function.client.WebClient;

// I had a lot of trouble fighting circular dependencies, so here's a separate class to make beans

@Configuration
public class Beans {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public StrategySelector strategySelector() {
        return new StrategySelector();
    }

    @Bean
    public TagSimilarityEvaluator tagSimilarityEvaluator() {
        return new TagSimilarityEvaluator();
    }

    @Bean
    public WebClient webClient() {
        return WebClient.create();
    }

    @Bean
    public AmazonS3 getAmazonS3Client() {
        var url = System.getenv("S3_URL");
        var region = System.getenv("S3_REGION");
        var endpointConfig = new EndpointConfiguration(url, region);

        // Credentials provided by AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
        return AmazonS3ClientBuilder
            .standard()
            .withEndpointConfiguration(endpointConfig)
            .withPathStyleAccessEnabled(true)
            .build();
    }
}
