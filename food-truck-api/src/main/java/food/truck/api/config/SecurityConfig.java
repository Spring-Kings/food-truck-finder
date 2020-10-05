package food.truck.api.config;

import food.truck.api.AuthenticationFilter;
import food.truck.api.AuthorizationFilter;
import food.truck.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserService userDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors()
                .and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, SecurityConstants.SIGN_UP_URL).permitAll()
                .antMatchers("/authtest1").authenticated()
                .anyRequest().permitAll()
                .and()
                .addFilter(new AuthenticationFilter(authenticationManager()))
                .addFilter(new AuthorizationFilter(authenticationManager(), userDetailsService))
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var configSource = new UrlBasedCorsConfigurationSource();
        List<String> origins;

        String frontendUrl = System.getenv("FOOD_TRUCK_FRONTEND");
        if (frontendUrl != null) {
            // TODO: this is a gross way to allow both http and https
            origins = List.of(frontendUrl, frontendUrl.replace("https://", "http://"));
        } else {
            // If frontend not configured, set to localhost for dev
            origins = List.of("https://localhost:3000", "http://localhost:3000");
        }

        var config = new CorsConfiguration();
        config
                .applyPermitDefaultValues()
                .setAllowedOrigins(origins);

        configSource.registerCorsConfiguration("/**", config);
        return configSource;
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }
}
