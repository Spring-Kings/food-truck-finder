package food.truck.api.notification;

import food.truck.api.truck.Truck;
import lombok.NonNull;
import lombok.Value;

import java.time.Instant;

@Value
public class NotificationView {
    long id;

    @NonNull
    Truck truck;

    @NonNull
    String message;

    @NonNull
    Instant time;

    boolean isRead;

    @NonNull
    String type;

    public static NotificationView of(Notification notif) {
        return new NotificationView(
            notif.getId(),
            notif.getSubscription().getTruck(),
            notif.getMessage(),
            notif.getTime(),
            notif.isRead(),
            "SUBSCRIPTION"
        );
    }

    public static NotificationView of(NearbyNotification notif) {
        return new NotificationView(
            notif.getId(),
            notif.getTruck(),
            notif.getMessage(),
            notif.getTime(),
            true,
            "LOCATION"
        );
    }
}
