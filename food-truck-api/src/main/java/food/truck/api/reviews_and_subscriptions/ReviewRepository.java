package food.truck.api.reviews_and_subscriptions;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByTruckId(Long truckId);
    List<Review> findByUserIdAndTruckId(Long userId, Long truckId);
}
