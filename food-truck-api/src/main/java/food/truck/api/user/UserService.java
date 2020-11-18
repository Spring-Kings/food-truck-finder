package food.truck.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findOneByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    public User createUser(String username, String password, String email, boolean isOwner) {
        var u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setEmail(email);
        u.setOwner(isOwner);
        u = saveUser(u);
        return u;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findOneByUsername(username);
    }

    public Optional<User> findUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> searchUsernames(String username) {
        return userRepository.findByUsername(username);
    }

    public void changePassword(User u, String newPassword) {
        u.setPassword(passwordEncoder.encode(newPassword));
    }

    public boolean passwordMatches(User u, String password) {
        return passwordEncoder.matches(password, u.getPassword());
    }

    public void deleteUser(long userId) {
        userRepository.deleteById(userId);
    }

    public boolean usernameIsTaken(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean usernameIsValid(String username) {
        return username.matches("[a-zA-Z0-9_]{3,30}");
    }

    public boolean passwordIsValid(String password) {
        return password.length() >= 6 && password.length() <= 50;
    }

    public boolean emailIsValid(String email) {
        return email.contains("@") && email.length() <= 100 || email.length() >= 3;
    }

}
