package food.truck.api.routes;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;


@Data
@Entity
@Table(name = "route_location")
public class RouteLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_location_id", nullable = false)
    Long routeLocationId;

    @JoinColumn(foreignKey = @ForeignKey(name = "route_id"), nullable = false)
    Long routeId;

    @Column(name="arrival_time", nullable = false)
    Timestamp arrivalTime;

    @Column(name="exit_time", nullable = false)
    Timestamp exitTime;

    @Column(name="lng", nullable = false)
    Double lng;

    @Column(name="lat", nullable = false)
    Double lat;


}
