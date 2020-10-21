package food.truck.api.routes;

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
    Route route;

    @Column(name = "arrival_time", nullable = false)
    Instant arrivalTime;

    @Column(name = "exit_time", nullable = false)
    Instant exitTime;

    @Column(name = "lng", nullable = false)
    double lng;

    @Column(name = "lat", nullable = false)
    double lat;
}
