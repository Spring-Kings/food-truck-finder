package food.truck.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static final SecureRandom RAND = new SecureRandom();

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> findUser(String username) {
        return userRepository.findOneByUsername(username);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> searchUsernames(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> authByToken(long id, String token) {
        var u = userRepository.findById(id);
        if (u.isEmpty())
            return Optional.empty();
        var user = u.get();
        if (user.getToken() == null || !user.getToken().equals(token) || OffsetDateTime.now().isAfter(user.getTokenExpiry())) {
            // Delete token if invalid to avoid brute force
            user.setToken(null);
            user.setTokenExpiry(null);
        }
        return u;
    }

    public Optional<User> authByLogin(String username, String password) {
        var u = this.findUser(username);
        if (u.isEmpty()) {
            return Optional.empty();
        }
        var user = u.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Optional.empty();
        }

        // Password OK
        var bytes = new byte[64];
        RAND.nextBytes(bytes);
        // bytes to hex string
        var token = new BigInteger(1, bytes).toString(16);
        user.setToken(token);
        user.setTokenExpiry(OffsetDateTime.now().plusHours(1));
        saveUser(user);

        return Optional.of(user);
    }

    public User createUser(String username, String password, String email) {
        var u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setEmail(email);
        u = saveUser(u);
        return u;
    }

}
