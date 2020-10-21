package food.truck.api.routes;

import food.truck.api.truck.Truck;
import lombok.Data;

import javax.persistence.*;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table( name = "route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id", nullable = false)
    Long routeId;

    @ManyToOne
    @JoinColumn(name = "truck_id", nullable = false)
    Truck truck;

    @Column(name = "route_name", nullable = true)
    String routeName;

    @Column(name = "active", nullable = false)
    char active;

    @OneToMany(mappedBy = "route")
    List<RouteLocation> locations;

    @ElementCollection
    Set<WeekDay> days = EnumSet.noneOf(WeekDay.class);
}
