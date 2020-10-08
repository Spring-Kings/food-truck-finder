package food.truck.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
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

// This filter is used to verify logins with username and password
// Somehow it is automatically used for POST /login.
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

            // Use authMgr to authenticate. If successful, this.successfulAuthentication will be called.
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
        Date expiry = Date.from(Instant.now().plus(SecurityConstants.EXPIRATION_DURATION));
        // Here we get a food.truck.api.User object because in SecurityConfig,
        // we configured the AuthenticationManager to use our version of UserService which returns
        // a User in loadUserByUsername.
        var user = (User) auth.getPrincipal();
        String username = user.getUsername();
        long id = user.getId();

        String token = Jwts.builder()
                .setSubject(username)
                .claim("userID", id)
                .setExpiration(expiry)
                .setIssuedAt(Date.from(Instant.now()))
                .signWith(SecurityConstants.SECRET_KEY, SecurityConstants.SIGNATURE_ALGORITHM)
                .compact();
        // If login is successful, add the token in the HTTP headers
        res.addHeader("token", token);

    }
}
