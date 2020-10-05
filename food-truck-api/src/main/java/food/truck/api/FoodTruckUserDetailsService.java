package food.truck.api;

import food.truck.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class FoodTruckUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository applicationUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var u = applicationUserRepository.findOneByUsername(username);
        if (u.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }
        return new org.springframework.security.core.userdetails.User(
                u.get().getUsername(), u.get().getPassword(), new ArrayList<>()
        );
    }
}
