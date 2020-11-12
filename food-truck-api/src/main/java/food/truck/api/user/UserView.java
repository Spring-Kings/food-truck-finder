package food.truck.api.user;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("owner")
    boolean isOwner; // Null is considered false

    public static UserView of(User u) {
        return new UserView(u.getUsername(), u.getId(), u.getEmail(), u.isOwner());
    }
}
