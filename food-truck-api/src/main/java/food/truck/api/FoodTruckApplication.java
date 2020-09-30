package food.truck.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
                var frontend = System.getenv("FOOD_TRUCK_FRONTEND");
                if (frontend == null)
                    registry.addMapping("/**").allowedOrigins("https://localhost:3000", "http://localhost:3000");
                else
                    registry.addMapping("/**").allowedOrigins(frontend);
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
