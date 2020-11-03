package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> findSubsByUser(User user){
        return subscriptionRepository.findByUser(user);
    }

    public List<Subscription> findSubsByTruck(Truck truck){
        return subscriptionRepository.findByTruck(truck);
    }

    public Subscription saveSubscription(Subscription subscription){
        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Subscription subscription) {
        subscriptionRepository.delete(subscription);
    }
}
