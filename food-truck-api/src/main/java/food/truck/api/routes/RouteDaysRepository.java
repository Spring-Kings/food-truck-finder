package food.truck.api.routes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteDaysRepository extends JpaRepository<RouteDays, Long> {
    List<Route> findByRouteId(Long id);

}