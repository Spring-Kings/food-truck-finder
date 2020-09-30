package food.truck.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

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
        if (u.isEmpty() || !u.get().getToken().equals(token))
            return Optional.empty();
        return u;
    }

}
