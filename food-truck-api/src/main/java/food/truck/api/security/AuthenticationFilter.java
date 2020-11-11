package food.truck.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

// This filter is used to verify logins with username and password
// Somehow it is automatically used for POST /login.
@Log4j2
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    public AuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Value
    public static class AuthenticationInfo {
        @NonNull String username;
        @NonNull String password;
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
            // The BadCredentialsException is caught by the superclass, I think
            throw new BadCredentialsException("Failed to read auth info", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) {
        // Here we get a food.truck.api.User object because in SecurityConfig,
        // we configured the AuthenticationManager to use our version of UserService which returns
        // a User in loadUserByUsername.
        var user = (User) auth.getPrincipal();
        String token = SecurityMethods.makeTokenForUser(user);

        // If login is successful, add the token in the HTTP headers
        res.addHeader("token", token);

    }
}
