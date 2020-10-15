package food.truck.api.routes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteLocationRepository extends JpaRepository<RouteLocation, Long> {
    List<RouteLocation> findByRouteId(Long id);
    void deleteAllByRouteId(Long routeId);
}
