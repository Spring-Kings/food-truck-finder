package food.truck.api.notification;

import food.truck.api.reviews_and_subscriptions.SubscriptionRepository;
import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    SubscriptionRepository subscriptionRepository;

    public List<Notification> findBySubscriptionId(long subId) {
        return notificationRepository.findBySubscriptionId(subId);
    }

    public List<Notification> findNotificationsByUser(User user) {
        var subscriptions = subscriptionRepository.findByUser(user);
        return subscriptions.stream()
            .flatMap(sub -> findNotificationsBySubscriptionId(sub.getId()).stream())
            .collect(Collectors.toList());
    }

    public List<Notification> findNotificationsByTruck(Truck truck) {
        var subscriptions = subscriptionRepository.findByTruck(truck);
        return subscriptions.stream()
            .flatMap(sub -> findNotificationsBySubscriptionId(sub.getId()).stream())
            .collect(Collectors.toList());
    }

    public List<Notification> findNotificationsBySubscriptionId(long id) {
        return notificationRepository.findBySubscriptionId(id);
    }

}
