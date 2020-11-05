package food.truck.api.user;

import lombok.Value;

import java.util.List;

@Value
public class UserPreferences {
    double acceptableRadiusMiles;
    double priceRating;
    String foodCategory; // TODO: Consider string or enum
    List<String> menuItems;
}
