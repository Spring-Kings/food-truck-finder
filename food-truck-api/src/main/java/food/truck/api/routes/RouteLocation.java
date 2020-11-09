package food.truck.api.routes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.LocationConverter;
import food.truck.api.Position;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "route_location")
public class RouteLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_location_id", nullable = false)
    long routeLocationId;

    @ManyToOne // many locations to one route
    @JoinColumn(name = "route_id", nullable = false)
    @JsonIgnoreProperties("locations")
    Route route;

    @Column(name = "arrival_time", nullable = false)
    Instant arrivalTime;

    @Column(name = "exit_time", nullable = false)
    Instant exitTime;

    @Convert(converter = LocationConverter.class)
    Position position;
}
