package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TruckRepository truckRepository;

    public List<Review> findReviewsByUserId(Long userId){
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> findReviewByTruckId(Long truckId){
        return reviewRepository.findByTruckId(truckId);
    }

    public Review saveReview(Review review){
        return reviewRepository.save(review);
    }


    public Review saveReview(Long userId, Truck t, int score, int costRating, String reviewText) {
        Review r = new Review();
        r.setId(userId);
        r.setTruck(t);
        r.setStarRating(score);
        r.setCostRating(costRating);
        r.setReviewText(reviewText);
        r.setDay_time(Timestamp.from(Instant.now()));
        return reviewRepository.save(r);
    }
}
