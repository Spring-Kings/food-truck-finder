package food.truck.api;

import food.truck.api.config.SecurityConstants;
import food.truck.api.user.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

@Log4j2
public class AuthorizationFilter extends BasicAuthenticationFilter {
    private final UserService userService;

    public AuthorizationFilter(AuthenticationManager authManager, UserService userService) {
        super(authManager);
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {
        String header = request.getHeader(SecurityConstants.HEADER_NAME);

        if (header != null) {
            UsernamePasswordAuthenticationToken authentication = this.authenticate(request);
            // Set principal, using the principal stored in the token returned by authenticate
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken authenticate(HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.HEADER_NAME);
        if (token == null)
            return null;

        // Parse JWT to get claims, which contains username etc
        // Note: a "Claims JWS" is a JWT that contains claims and is signed
        Claims claims;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(SecurityConstants.SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            log.info("Invalid token", e);
            return null;
        }

        // If successful, load the user w/ the username and create a token
        // with the user as the auth. principal
        if (claims != null) {
            String username = claims.getSubject();
            var authPrincipal = userService.loadUserByUsername(username);
            return new UsernamePasswordAuthenticationToken(authPrincipal, null, new ArrayList<>());
        } else {
            return null;
        }

    }
}
