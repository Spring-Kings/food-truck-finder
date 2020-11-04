package food.truck.api.notification;

import food.truck.api.reviews_and_subscriptions.Subscription;
import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Data
@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id", nullable = false)
    long id;

    @ManyToOne
    @JoinColumn(name = "subscription_ID", nullable = false)
    Subscription subscription;

    @Column(name = "message", nullable = false)
    String message;

    // This gets returned in json as "read" because Lombok likes to be smart
    @Column(name = "is_read", nullable = false)
    boolean isRead;

    @Column(name = "time", nullable = false)
    Instant time;
}
