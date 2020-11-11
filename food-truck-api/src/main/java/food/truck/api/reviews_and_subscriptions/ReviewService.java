package food.truck.api.reviews_and_subscriptions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> findReviewsByUserId(Long userId){
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> findReviewByTruckId(Long truckId){
        return reviewRepository.findByTruckId(truckId);
    }

    public Review saveReview(Review review){
        return reviewRepository.save(review);
    }


}
