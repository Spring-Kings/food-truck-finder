package food.truck.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import food.truck.api.config.SecurityConstants;
import food.truck.api.user.User;
import io.jsonwebtoken.Jwts;
import lombok.NonNull;
import lombok.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;


public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    public AuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Value
    private static class AuthenticationInfo {
        @NonNull String Username;
        @NonNull String Password;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException {
        try {
            // Read auth info from request body using jackson
            var authInfo = new ObjectMapper().readValue(req.getInputStream(), AuthenticationInfo.class);

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authInfo.getUsername(),
                            authInfo.getPassword(), new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) {
        Date expiry = new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME_MS);
        var username = ((User) auth.getPrincipal()).getUsername();

        String token = Jwts.builder()
                .setSubject(username)
                .setExpiration(expiry)
                .setIssuedAt(Date.from(Instant.now()))
                .signWith(SecurityConstants.SECRET_KEY, SecurityConstants.SIGNATURE_ALGORITHM)
                .compact();
        res.addHeader("token", token);

    }
}
