package food.truck.api.security;

import food.truck.api.Location;
import food.truck.api.LocationService;
import food.truck.api.user.Guest;
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

// This filter is used on every request to check for a header called SecurityConstants.HEADER_NAME
// and it parses/verifies the token stored there, loads the User object, and sets the User as
// the authentication principal
@Log4j2
public class AuthorizationFilter extends BasicAuthenticationFilter {
    private final UserService userService;
    private final LocationService locationService;

    public AuthorizationFilter(AuthenticationManager authManager, UserService userSvc, LocationService locSvc) {
        super(authManager);
        userService = userSvc;
        locationService = locSvc;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {
        String header = request.getHeader(SecurityConstants.HEADER_NAME);
        Location loc;
        try {
            loc = locationService.estimateLocation(request);
        } catch (Exception e) {
            log.warn("Failed to estimate location", e);
            // Fall back to some random place in Waco
            loc = new Location(31.546807, -97.120069);
        }

        if (header != null) {
            UsernamePasswordAuthenticationToken authentication = this.authenticate(request, loc);
            // Set principal, using the principal stored in the token returned by authenticate
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            var guest = new Guest(loc);
            var auth = new UsernamePasswordAuthenticationToken(guest, null, new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken authenticate(HttpServletRequest request, Location loc) {
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
            authPrincipal.setLocation(loc);
            return new UsernamePasswordAuthenticationToken(authPrincipal, null, authPrincipal.getAuthorities());
        } else {
            return null;
        }

    }
}
