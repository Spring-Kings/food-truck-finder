package food.truck.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class FoodTruckApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodTruckApplication.class);
    }

    @Bean
    public WebMvcConfigurer addCors() {
        // Figured out from looking at https://spring.io/guides/gs/rest-service-cors/#global-cors-configuration
        // TODO secure our endpoints a bit better than this
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("*").allowedOrigins(System.getenv("FOOD_TRUCK_FRONTEND"));
            }
        };
    }
}
