package food.truck.api.endpoint;

import food.truck.api.notification.NotificationService;
import food.truck.api.notification.NotificationView;
import food.truck.api.reviews_and_subscriptions.SubscriptionService;
import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import lombok.NonNull;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    }

    @Secured({"ROLE_OWNER"})
    @PostMapping("/truck/notification")
    public boolean sendNotificationForTruck(
        @AuthenticationPrincipal User u,
        @RequestBody SendNotificationParams notificationParams
    ) {
        var t = truckService.findTruckById(notificationParams.truckId);
        if (t.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found");
        }
        var truck = t.get();
        if (!truck.getUserId().equals(u.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        var subscriptions = subscriptionService.findSubsByTruck(truck);
        notificationService.saveNotification(subscriptions, notificationParams.message);
        notificationService.saveNearbyNotification(truck, notificationParams.message);
        return true;
    }

    @Secured({"ROLE_OWNER"})
    @GetMapping("/truck/{truckId}/notifications")
    public List<NotificationView> getNotificationsForTruck(
        @AuthenticationPrincipal User u,
        @PathVariable long truckId
    ) {
        var t = truckService.findTruckById(truckId);
        if (t.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found");
        }
        var truck = t.get();
        if (!truck.getUserId().equals(u.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return notificationService.findNotificationsByTruck(truck);
    }

    @GetMapping("/notifications")
    public List<NotificationView> getNotificationsForUser(@AuthenticationPrincipal AbstractUser user) {
        return notificationService.findNotificationsByUser(user);
    }

    @Value
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
        if (notification.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var n = notification.get();
        if (!n.getSubscription().getUser().getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        n.setRead(updateStatus.isRead);
        notificationService.saveNotification(n);
    }

    @Secured({"ROLE_USER"})
    @DeleteMapping("/notification/{notificationId}/delete")
    public void deleteNotification(
        @AuthenticationPrincipal User user,
        @PathVariable long notificationId
    ) {
        var notification = notificationService.findById(notificationId);
        if (notification.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var n = notification.get();
        if (!n.getSubscription().getUser().getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        notificationService.deleteNotification(n);
    }
}
