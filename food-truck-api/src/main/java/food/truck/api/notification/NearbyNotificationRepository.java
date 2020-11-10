package food.truck.api.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NearbyNotificationRepository extends JpaRepository<NearbyNotification, Long> {
    List<NearbyNotification> findByTruckId(long truckId);
}