package food.truck.api.notification;

import food.truck.api.reviews_and_subscriptions.Subscription;
import food.truck.api.truck.Truck;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Data
@Entity
@Table(name = "nearby_notification")
public class NearbyNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id", nullable = false)
    long id;

    @ManyToOne
    @JoinColumn(name = "truck_id")
    Truck truck;

    @Column(name = "message", nullable = false)
    String message;

    @Column(name = "time", nullable = false)
    Instant time;

    @Column(name = "latitude")
    double latitude;

    @Column(name = "longitude")
    double longitude;
}
