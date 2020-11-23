package food.truck.api.notification;

import food.truck.api.Position;
import food.truck.api.PositionConverter;
import food.truck.api.truck.Truck;
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

    @Convert(converter = PositionConverter.class)
    @Column(name = "position")
    Position position;
}
