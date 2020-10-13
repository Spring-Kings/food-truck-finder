package food.truck.api.ReviewsAndSubscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRespository subscriptionRespository;

    public List<Subscription> findSubsByUser(User user){
        return subscriptionRespository.findByUser(user);
    }

    public List<Subscription> findSubsByTruck(Truck truck){
        return subscriptionRespository.findByTruck(truck);
    }

    public Subscription saveSubscription(Subscription subscription){
        return subscriptionRespository.save(subscription);
    }
}
