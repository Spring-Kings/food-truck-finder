package food.truck.api.notification;

import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.reviews_and_subscriptions.SubscriptionRepository;
import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    SubscriptionRepository subscriptionRepository;

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

    public List<NotificationView> findNotificationsByUser(User user) {
        var subscriptions = subscriptionRepository.findByUser(user);
        return subscriptions.stream()
            .flatMap(sub -> findNotificationsBySubscriptionId(sub.getId()).stream())
            .map(NotificationView::of)
            .collect(Collectors.toList());
    }

    public List<NotificationView> findNotificationsByTruck(Truck truck) {
        var subscriptions = subscriptionRepository.findByTruck(truck);
        return subscriptions.stream()
            .flatMap(sub -> findNotificationsBySubscriptionId(sub.getId()).stream())
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
}