package food.truck.api.notification;

import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionRepository;
import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckService;
import food.truck.api.user.AbstractUser;
import food.truck.api.user.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    NearbyNotificationRepository nearbyNotificationRepository;

    @Autowired
    SubscriptionRepository subscriptionRepository;

    @Autowired
    TruckService truckService;

    @Autowired
    JavaMailSender mailSender;

    public Optional<Notification> findById(long id) {
        return notificationRepository.findById(id);
    }

    public List<NotificationView> findBySubscriptionId(long subId) {
        return notificationRepository.findBySubscriptionId(subId)
            .stream()
            .map(NotificationView::of)
            .collect(Collectors.toList());
    }

    public List<NotificationView> findNotificationsByUser(AbstractUser user) {
        var notifications = findNearbyNotifications(user, 30);
        if (user instanceof User) {
            var authenticatedUser = (User)user;
            notifications.addAll(findNotificationsByUser(authenticatedUser));
            notifications = notifications
                .stream()
                .filter(notification -> !truckService.userOwnsTruck(authenticatedUser, notification.getTruck().getId()))
                .filter(notification -> {
                    if (notification.getType().equals("LOCATION")) {
                        var subscriptions = subscriptionRepository.findByUser(authenticatedUser);
                        return subscriptions
                            .stream()
                            .noneMatch(sub -> sub.getTruck().getId().equals(notification.getTruck().getId()));
                    }
                    return true;
                })
                .collect(Collectors.toList());
        }
        return notifications;
    }

    public List<NotificationView> findNotificationsByUser(User user) {
        var subscriptions = subscriptionRepository.findByUser(user);
        return subscriptions.stream()
            .flatMap(sub -> findNotificationsBySubscriptionId(sub.getId()).stream())
            .map(NotificationView::of)
            .sorted(Comparator.comparing(NotificationView::getTime))
            .collect(Collectors.toList());
    }

    public List<NotificationView> findNotificationsByTruck(Truck truck) {
        var subscriptions = subscriptionRepository.findByTruck(truck);
        return subscriptions.stream()
            .flatMap(sub -> findNotificationsBySubscriptionId(sub.getId()).stream())
            .map(NotificationView::of)
            .sorted(Comparator.comparing(NotificationView::getTime))
            .collect(Collectors.toList());
    }

    public List<NotificationView> findNearbyNotifications(AbstractUser user, double milesThreshold) {
        var notifications = nearbyNotificationRepository.findAll();
        return notifications.stream()
            .filter(notif -> user
                .getPosition()
                .distanceInMiles(notif.getPosition()) < milesThreshold)
            .map(NotificationView::of)
            .collect(Collectors.toList());
    }

    public List<Notification> findNotificationsBySubscriptionId(long id) {
        return notificationRepository.findBySubscriptionId(id);
    }

    public void saveNotification(List<Subscription> subscriptions, String message) {
        var emails = subscriptions.stream().map(sub -> sub.getUser().getEmail()).iterator();
        for (var subscription : subscriptions) {
            if (!emails.hasNext()) {
                break;
            }

            // Save notification for in-app notifications
            var n = new Notification();
            n.setSubscription(subscription);
            n.setMessage(message);
            n.setTime(Instant.now());
            notificationRepository.save(n);

            // Send email notification
            var msg = mailSender.createMimeMessage();
            var from = System.getenv("GOOGLE_SMTP_USERNAME");
            log.info("from: " + from);
            try {
                msg.setFrom(from);
                msg.setRecipients(MimeMessage.RecipientType.TO, emails.next());
                msg.setText(message);
                msg.setSubject("Stacked Trucks: Notification from " + subscription.getTruck().getName());
                mailSender.send(msg);
            } catch (MessagingException msgException) {
                log.warn("Could not create message: " + msgException);
            } catch (MailException mailException) {
                log.warn("Could not send email: " + mailException);
            }
        }
    }

    public void saveNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    public void deleteNotification(Notification notification) {
        notificationRepository.delete(notification);
    }

    public void saveNearbyNotification(Truck truck, String message) {
        var routeLocation = truckService.getCurrentRouteLocation(truck.getId());
        routeLocation.ifPresent(loc -> {
            var n = new NearbyNotification();
            n.setTruck(truck);
            n.setMessage(message);
            n.setTime(Instant.now());
            n.setPosition(loc.getPosition());
            nearbyNotificationRepository.save(n);
        });
    }
}
