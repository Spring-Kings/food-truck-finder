package food.truck.api.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class SecurityConstants {
    public static final String SIGN_UP_URL = "/register";
    public static final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS512;
    // Generate secret key at start up
    public static final SecretKey SECRET_KEY = Keys.secretKeyFor(SIGNATURE_ALGORITHM);
    public static final String HEADER_NAME = "Authorization";
    public static final Long EXPIRATION_TIME_MS = 1000L * 60 * 30;
}
