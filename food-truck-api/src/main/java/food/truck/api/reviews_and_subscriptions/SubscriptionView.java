package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.user.UserView;
import lombok.NonNull;
import lombok.Value;

@Value
public class SubscriptionView {
    long id;

    @NonNull
    UserView user;

    @NonNull
    Truck truck;

    public static SubscriptionView of(Subscription sub) {
        return new SubscriptionView(sub.getId(), UserView.of(sub.getUser()), sub.getTruck());
    }
}
