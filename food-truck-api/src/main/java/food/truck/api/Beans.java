package food.truck.api;

import food.truck.api.recommendation.StrategySelector;
import food.truck.api.recommendation.semantic_similarity.TagSimilarityEvaluator;
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
}
