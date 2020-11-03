package food.truck.api.notification;

import food.truck.api.truck.Truck;
import lombok.NonNull;
import lombok.Value;

import java.time.Instant;

@Value
public class NotificationView {
    long id;

    @NonNull
    Truck t;

    @NonNull
    String message;

    @NonNull
    Instant time;

    public static NotificationView of(Notification notif) {
        return new NotificationView(
            notif.getId(),
            notif.getSubscription().getTruck(),
            notif.getMessage(),
            notif.getTime()
        );
    }
}
