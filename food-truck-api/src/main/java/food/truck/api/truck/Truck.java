package food.truck.api.truck;

import com.fasterxml.jackson.annotation.JsonIgnore;
import food.truck.api.MediaTypeConverter;
import food.truck.api.security.SecurityConstants;
import lombok.Data;
import org.jetbrains.annotations.Nullable;
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

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    @Nullable
    @Column(name = "menu", length = SecurityConstants.MAX_UPLOAD_SIZE)
    byte[] menu;

    @Column(name = "menu_content_type")
    @Convert(converter = MediaTypeConverter.class)
    @Nullable
    @JsonIgnore
    MediaType menuContentType;

    @Column(name = "price_rating")
    @Nullable
    Long priceRating;

    @Column(name = "description")
    @Nullable
    String description;

    @ElementCollection
    Set<String> tags;

    @JsonIgnore
    public boolean hasTag(String tag) {
        tag = tag.toLowerCase().strip();
        return tags.contains(tag);
    }
}
