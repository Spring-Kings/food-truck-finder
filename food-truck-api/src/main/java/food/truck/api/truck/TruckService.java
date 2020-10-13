package food.truck.api.truck;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TruckService {
    @Autowired
    private TruckRepository truckRepository;

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

    public void deleteTruck(Long truckId) {
        truckRepository
            .findById(truckId)
            .ifPresent(truckRepository::delete);
    }

    public Truck updateTruck(
        @NonNull
        Truck truck,
        Optional<String> name,
        Optional<byte[]> menu,
        Optional<String> textMenu,
        Optional<Long> priceRating,
        Optional<String> description,
        Optional<byte[]> schedule,
        Optional<String> foodCategory
    ) {
        name.ifPresent(truck::setName);
        truck.setMenu(menu.orElse(null));
        truck.setTextMenu(textMenu.orElse(null));
        truck.setPriceRating(priceRating.orElse(null));
        truck.setDescription(description.orElse(null));
        truck.setSchedule(schedule.orElse(null));
        truck.setFoodCategory(foodCategory.orElse(null));
        return saveTruck(truck);
    }
}
