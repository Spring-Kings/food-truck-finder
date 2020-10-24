package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckRepository;
import food.truck.api.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TruckRepository truckRepository;

    public List<Review> findReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> findReviewByTruckId(Long truckId) {
        return reviewRepository.findByTruckId(truckId);
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }


    public Review saveReview(Long userId, Truck t, int score, int costRating, String reviewText) {
        // Get the current review, if it exists, or create a new one
        Optional<Review> rOpt = reviewRepository.findByUserIdAndTruckId(userId, t.getId()).stream().findFirst();
        Review r = rOpt.orElse(new Review());

        // Populate the review
        r.setUserId(userId);
        r.setTruck(t);
        r.setStarRating(score);
        r.setCostRating(costRating);
        r.setReviewText(reviewText);
        r.setDay_time(Timestamp.from(Instant.now()));
        return reviewRepository.save(r);
    }

    public boolean deleteReviewByUser(User u, long reviewId) {
        Review r = reviewRepository.findById(reviewId).orElse(null);
        if (r == null)
            return false; // TODO make return a 404
        else if (!r.getUserId().equals(u.getId()))
            return false; // TODO make return a 403

        // Delete review
        reviewRepository.delete(r);
        return true;
    }
}
