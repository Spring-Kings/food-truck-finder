package food.truck.api.user;


import food.truck.api.truck.Truck;
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
    @Column(name = "review_ID", nullable = false)
    long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "truck_id", nullable = false)
    Truck truck;

    @Column(name = "star_rating", nullable = false)
    int starRating;

    @Column(name = "cost_rating", nullable = false)
    int costRating;

    @Column(name = "review_text", nullable = true)
    String reviewText;

    @Column(name = "date", nullable = false)
    Date day_time;


}
