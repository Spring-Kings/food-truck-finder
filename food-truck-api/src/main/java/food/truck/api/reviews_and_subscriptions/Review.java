package food.truck.api.reviews_and_subscriptions;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import food.truck.api.truck.Truck;
import lombok.Data;
import org.jetbrains.annotations.Nullable;

import javax.persistence.*;
import java.sql.Timestamp;

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

    @ManyToOne
    @JoinColumn(name = "truck_id", nullable = false)
    @JsonIgnore
    Truck truck;

    @JsonProperty("truckId")
    long truckId() {
        return truck.getId();
    }

    @Column(name = "star_rating", nullable = false)
    Integer starRating;

    @Column(name = "cost_rating", nullable = false)
    Integer costRating;

    @Column(name = "review_text")
    @Nullable
    String reviewText;

    @Column(name = "date", nullable = false)
    Timestamp day_time;


}
