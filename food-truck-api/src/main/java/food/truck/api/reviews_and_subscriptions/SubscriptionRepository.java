package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUser(User User);
    List<Subscription> findByTruck(Truck Truck);
}
