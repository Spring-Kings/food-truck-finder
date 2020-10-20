package food.truck.api.security;

import food.truck.api.user.User;
import io.jsonwebtoken.Jwts;

import java.time.Instant;
import java.util.Date;

public class SecurityMethods {
    public static String makeTokenForUser(User u) {
        Date expiry = Date.from(Instant.now().plus(SecurityConstants.EXPIRATION_DURATION));
        return Jwts.builder()
                .setSubject(u.getUsername())
                .claim("userID", u.getId())
                .setExpiration(expiry)
                .setIssuedAt(Date.from(Instant.now()))
                .signWith(SecurityConstants.SECRET_KEY, SecurityConstants.SIGNATURE_ALGORITHM)
                .compact();
    }
}
