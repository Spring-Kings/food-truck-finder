package food.truck.api.truck;

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

    public Truck saveTruck(Truck truck) {
        return truckRepository.save(truck);
    }

    // Consider how to pass optional parameters more cleanly.
    // e.g.   Optional<byte[]> menu,
    //        Optional<String> textMenu,
    //        Optional<Long> priceRating,
    //        Optional<String> description,
    //        Optional<byte[]> schedule,
    //        Optional<String> foodCategory
    // without the list being huge (endpoint params object?)
    public Truck createTruck(Long userId, String name) {
        var t = new Truck();
        t.setName(name);
        t.setUserId(userId);
        return saveTruck(t);
    }

    public Truck updateTruck(Truck truck) {
        // TODO
        return null;
    }
}
