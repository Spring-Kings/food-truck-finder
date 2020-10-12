package food.truck.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
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

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findOneByUsername(username);
    }

    public Optional<User> findUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> searchUsernames(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(String username, String password, String email) {
        var u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setEmail(email);
        u = saveUser(u);
        return u;
    }

    public void changePassword(User u, String newPassword) {
        u.setPassword(passwordEncoder.encode(newPassword));
    }

    public boolean passwordMatches(User u, String password) {
        return passwordEncoder.matches(password, u.getPassword());
    }

}
