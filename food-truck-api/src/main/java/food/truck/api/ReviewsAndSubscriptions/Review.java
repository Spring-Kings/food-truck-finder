package food.truck.api.ReviewsAndSubscriptions;


import food.truck.api.truck.Truck;
import food.truck.api.user.User;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name="review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    Long id;

    @JoinColumn(foreignKey = @ForeignKey(name = "user_id"), nullable = false)
    Long userId;

    @JoinColumn(foreignKey = @ForeignKey(name = "truck_id"), nullable = false)
    Long truckId;

    @Column(name = "star_rating", nullable = false)
    Integer starRating;

    @Column(name = "cost_rating", nullable = false)
    Integer costRating;

    @Column(name = "review_text", nullable = true)
    String reviewText;

    @Column(name = "date", nullable = false)
    Date day_time;


}
