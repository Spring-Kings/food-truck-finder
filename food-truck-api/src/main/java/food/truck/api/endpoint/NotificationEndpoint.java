package food.truck.api.endpoint;

import food.truck.api.notification.Notification;
import food.truck.api.notification.NotificationService;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.TruckService;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
public class NotificationEndpoint {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    TruckService truckService;

    @Value
    public static class SendNotificationParams {
        long truckId;
        @NonNull
        String message;
        // TODO: different types of notifications
    }

    @Secured({"ROLE_USER"})
    @PostMapping("/truck/{truckId}/notification")
    public boolean sendNotificationForTruck(
        @AuthenticationPrincipal User u,
        @RequestBody SendNotificationParams notificationParams
    ) {
        var t = truckService.findTruckById(notificationParams.truckId);
        if (t.isEmpty()) {
            return false;
        }
        var truck = t.get();
        if (!truck.getUserId().equals(u.getId()) && u.getIsOwner()) {
            return false;
        }
        var subscriptions = subscriptionService.findSubsByTruck(truck);
        for (var subscription : subscriptions) {
            notificationService.saveNotification(subscription, notificationParams.message);
        }
        return true;
    }

    @Secured({"ROLE_USER"})
    @GetMapping("/truck/{truckId}/notifications")
    public List<Notification> sendNotificationForTruck(
        @AuthenticationPrincipal User u,
        @PathVariable long truckId
    ) {
        var t = truckService.findTruckById(truckId);
        if (t.isEmpty()) {
            return List.of();
        }
        var truck = t.get();
        if (!truck.getUserId().equals(u.getId()) && u.getIsOwner()) {
            return List.of();
        }
        return notificationService.findNotificationsByTruck(truck);
    }

    @Secured({"ROLE_USER"})
    @GetMapping("/notifications")
    public List<Notification> getNotificationsForUser(@AuthenticationPrincipal User user) {
        return notificationService.findNotificationsByUser(user);
    }

    public static class UpdateNotificationStatusParams {
        long notificationId;
        boolean isRead;
    }

    @Secured({"ROLE_USER"})
    @PutMapping("/notification/read")
    public void setNotificationReadStatus(
        @AuthenticationPrincipal User user,
        @RequestBody UpdateNotificationStatusParams updateStatus
    ) {
        var notification = notificationService.findById(updateStatus.notificationId);
        notification.ifPresent(n -> {
            if (n.getSubscription().getUser().getId() == user.getId()) {
                n.setRead(updateStatus.isRead);
                notificationService.saveNotification(n);
            }
        });
    }
}
