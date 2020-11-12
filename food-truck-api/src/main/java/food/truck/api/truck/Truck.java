package food.truck.api.truck;

import lombok.Data;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;

import javax.persistence.*;

@Data
@Entity
@Indexed
@Table(name = "truck")
public class Truck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "truck_id", nullable = false)
    Long id;

    @JoinColumn(foreignKey = @ForeignKey(name = "user_id"), nullable = false)
    Long userId;

    @Field(name = "name")
    @Column(name = "name", nullable = false)
    String name;

    // TODO: store actual menu, potentially an image?
    @Column(name = "menu")
    byte[] menu;

    @Field( name= "text_menu")
    @Column(name = "text_menu")
    String textMenu;

    @Column(name = "price_rating")
    Double priceRating;

    @Column(name = "star_rating")
    Double starRating;

    @Field(name = "description")
    @Column(name = "description")
    String description;

    // TODO: use an actual schedule
    @Column(name = "schedule")
    byte[] schedule;

    @Field(name = "foodCategory")
    @Column(name = "foodCategory")
    String foodCategory;
}
