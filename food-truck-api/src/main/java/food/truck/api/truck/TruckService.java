package food.truck.api.truck;

import food.truck.api.Position;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteRepository;
import food.truck.api.routes.RouteService;
import food.truck.api.search.IndexingService;
import food.truck.api.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TruckService {
    @Autowired
    private TruckRepository truckRepository;
    @Autowired
    private RouteService routeService;
    @Autowired
    private RouteRepository routeRepository;

    public List<Truck> findTruck(String name) {
        return truckRepository.findByName(name);
    }

    public List<Truck> findTruck(Long userId) {
        return truckRepository.findByUserId(userId);
    }

    public Optional<Truck> findTruckById(Long truckId) {
        return truckRepository.findById(truckId);
    }

    public Truck saveTruck(Truck truck) {
        return truckRepository.save(truck);
    }

    public Truck createTruck(Long userId, String name) {
        var t = new Truck();
        t.setName(name);
        t.setUserId(userId);
        return saveTruck(t);
    }

    public void deleteTruck(long truckId) {
        var t = truckRepository.findById(truckId);
        if (t.isEmpty())
            return;
        Truck truck = t.get();
        routeService.findRouteByTruck(truck)
                .forEach(r -> routeService.deleteRoute(r.getRouteId()));
        truckRepository.delete(truck);
    }

    public Truck updateTruck(
            long truckId,
            Optional<String> name,
            Optional<byte[]> menu,
            Optional<String> textMenu,
            Optional<Double> priceRating,
            Optional<String> description,
            Optional<byte[]> schedule,
            Optional<String> foodCategory
    ) {
        var t = findTruckById(truckId);
        if (t.isEmpty())
            return null;
        var truck = t.get();
        name.ifPresent(truck::setName);
        truck.setMenu(menu.orElse(null));
        truck.setTextMenu(textMenu.orElse(null));
        if (truck.getPriceRating() == null)
            truck.setPriceRating(priceRating.orElse(null));
        truck.setDescription(description.orElse(null));
        truck.setSchedule(schedule.orElse(null));
        truck.setFoodCategory(foodCategory.orElse(null));
        return saveTruck(truck);
    }

    public Route getActiveRoute(long truckId, DayOfWeek w) {
        return routeRepository.findByTruckId(truckId).stream()
                .filter(r -> r.isActive() && r.getDays().contains(w))
                .findFirst()
                .orElse(null);
    }

    public Route getActiveRoute(long truckId) {
        return getActiveRoute(truckId, OffsetDateTime.now(ZoneOffset.UTC).getDayOfWeek());
    }

    public Optional<RouteLocation> getCurrentRouteLocation(long truckId) {
        var route = getActiveRoute(truckId);
        if (route == null)
            return Optional.empty();

        return routeService.getCurrentRouteLocation(route.getRouteId());
    }

    public List<Truck> getTrucksCloseToLocation(Position loc, double radiusMiles) {
        return truckRepository.findAll().stream().filter(truck -> {
                    var curLoc = getCurrentRouteLocation(truck.id);
                    if (curLoc.isEmpty())
                        return false;
                    var truckLocation = curLoc.get().getPosition();
                    double distance = loc.distanceInMiles(truckLocation);
                    return distance < radiusMiles;
                }
        ).collect(Collectors.toList());
    }

    public boolean userOwnsTruck(User u, long truckId) {
        var t = findTruckById(truckId);
        return t.isPresent() && t.get().getUserId().equals(u.getId());
    }
}
