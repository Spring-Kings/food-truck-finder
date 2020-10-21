package food.truck.api.routes;

import food.truck.api.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findOneByRouteId(Long id);

    List<Route> findByTruck(Truck truck);

    void deleteByRouteId(long routeId);
}
