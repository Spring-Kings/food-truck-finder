package food.truck.api.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.time.Duration;

public class SecurityConstants {
    public static final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS512;
    // Generate secret key at start up
    public static final SecretKey SECRET_KEY = Keys.secretKeyFor(SIGNATURE_ALGORITHM);
    public static final String HEADER_NAME = "Authorization";
    public static final Duration EXPIRATION_DURATION = Duration.ofHours(1);
}
