package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="subscription")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_ID", nullable = false)
    Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name="truck_id", nullable = false)
    Truck truck;
}
