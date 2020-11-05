package food.truck.api.user;

import lombok.Value;

import java.util.List;

@Value
public class UserPreferences {
    double acceptibleRadius;
    double priceRating;
    String foodCategories;
    List<String> menuItems;
}
