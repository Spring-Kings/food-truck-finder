package food.truck.api.truck;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.http.MediaType;

import javax.persistence.*;
import java.util.Set;

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

    @Column(name = "menu")
    @Lob
    @Basic(fetch = FetchType.LAZY)
    byte[] menu;

    @Column(name = "menu_content_type")
    MediaType menuContentType;

    @Column(name = "price_rating")
    Long priceRating;

    @Column(name = "description")
    String description;

    @ElementCollection
    Set<String> menuTags;

    @JsonIgnore
    public boolean hasTag(String tag) {
        tag = tag.toLowerCase().strip();
        return menuTags.contains(tag);
    }
}
