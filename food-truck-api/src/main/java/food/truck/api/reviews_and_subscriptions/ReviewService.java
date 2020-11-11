package food.truck.api.reviews_and_subscriptions;

import food.truck.api.truck.Truck;
import food.truck.api.truck.TruckRepository;
import food.truck.api.user.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
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

    public Review findReviewById(long reviewId) {
        Optional<Review> r = reviewRepository.findById(reviewId);
        return r.orElse(null);
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
        var result = reviewRepository.save(r);
        updateAverageRating(result);
        return result;
    }

    public boolean deleteReviewByUser(User u, long truckId) {
        Review r = reviewRepository.findByUserIdAndTruckId(u.getId(), truckId).stream().findFirst().orElse(null);
        if (r == null)
            return false;

        // Delete review
        reviewRepository.delete(r);
        updateAverageRating(r);
        return true;
    }

    public Optional<Review> findReviewForUser(Long userId, Long truckId) {
        return reviewRepository.findByUserIdAndTruckId(userId, truckId).stream().findFirst();
    }

    private void updateAverageRating(Review review) {
        var truck = review.getTruck();
        var coll = reviewRepository.findByTruckId(truck.getId());

        // Get new average cost and star ratings
        Long cost = null;
        Long star = null;

        if (coll.size() != 0) {
            cost = coll.stream()
                    .collect(Collectors.averagingInt(Review::getCostRating))
                    .longValue();
            star = coll.stream()
                    .collect(Collectors.averagingInt(Review::getStarRating))
                    .longValue();
        }

        // Persist new rating
        truck.setPriceRating(cost);
        truck.setStarRating(star);
        truckRepository.save(truck);
    }
}
