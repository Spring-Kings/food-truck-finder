package food.truck.api.routes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteLocationRepository extends JpaRepository<RouteLocation, Long> {
    List<RouteLocation> findByRoute_routeId(long id);

    void deleteAllByRoute_routeId(long id);
}
