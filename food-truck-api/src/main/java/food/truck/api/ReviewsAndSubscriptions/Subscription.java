package food.truck.api.user;

import food.truck.api.truck.Truck;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="review")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_ID", nullable = false)
    long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name="truck_id", nullable = false)
    Truck truck;
}
