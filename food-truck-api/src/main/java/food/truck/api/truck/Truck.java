package food.truck.api.truck;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "truck")
public class Truck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "truck_id", nullable = false)
    Long id;

    @JoinColumn(foreignKey = @ForeignKey(name = "user_id"), nullable = false)
    Long userId;

    @Column(name = "name", nullable = false)
    String name;

    // TODO: store actual menu, potentially an image?
    @Column(name = "menu")
    byte[] menu;

    @Column(name = "text_menu")
    String textMenu;

    @Column(name = "price_rating")
    Long priceRating;

    @Column(name = "description")
    String description;

    // TODO: use an actual schedule
    @Column(name = "schedule")
    byte[] schedule;

    @Column(name = "foodCategory")
    String foodCategory;
}
