package food.truck.api.user;

import lombok.Value;

import java.util.Set;

@Value
public class UserPreferences {
    double acceptableRadius;
    double priceRating;
    int numRequested;
    Set<String> menuItems;
    Set<String> tags;
}
