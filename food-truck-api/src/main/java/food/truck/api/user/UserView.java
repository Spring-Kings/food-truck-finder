package food.truck.api.user;

import lombok.NonNull;
import lombok.Value;
import org.springframework.lang.Nullable;

// Class that represents user data that we return to the front end, since it would be insecure
// to directly return the whole user object
@Value
public class UserView {
    @NonNull String username;
    long id;
    @Nullable
    String email; // Nullable in case we decide you aren't allowed to see it

    public static UserView of(User u) {
        return new UserView(u.getUsername(), u.getId(), u.getEmail());
    }
}