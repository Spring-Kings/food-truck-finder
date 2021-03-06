package food.truck.api.routes;

import food.truck.api.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByTruck(Truck truck);
    List<Route> findByTruckId(long truckId);
}
