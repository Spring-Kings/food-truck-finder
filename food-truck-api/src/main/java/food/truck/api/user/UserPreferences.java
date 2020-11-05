package food.truck.api.user;

import lombok.Value;

import java.util.List;

@Value
public class UserPreferences {
    double acceptableRadius;
    double priceRating;
    int numRequested;
    String foodCategory; // TODO: Consider string or enum
    List<String> menuItems;
}
