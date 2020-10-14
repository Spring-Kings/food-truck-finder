package food.truck.api.routes;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;


@Data
@Table(name = "route_location")
public class RouteLocation {

    @JoinColumn(foreignKey = @ForeignKey(name = "route_id"), nullable = false)
    Long routeId;

    @Column(name="arrival_time", nullable = false)
    Timestamp arrivalTime;

    @Column(name="exit_time", nullable = false)
    Timestamp exitTime;




}
