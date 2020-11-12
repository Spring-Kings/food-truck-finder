package food.truck.api.routes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.truck.Truck;
import lombok.Data;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
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

    @Column(name = "route_name", nullable = false)
    String routeName;

    @Column(name = "active", nullable = false)
    boolean active;

    @OneToMany(mappedBy = "route")
    @JsonIgnoreProperties("route")
    List<RouteLocation> locations;

    @ElementCollection
    Set<DayOfWeek> days = EnumSet.noneOf(DayOfWeek.class);

    @Override
    public String toString() {
        return "Route{" +
                "routeId=" + routeId +
                ", truck=" + truck +
                ", routeName='" + routeName + '\'' +
                ", active=" + active +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Route route = (Route) o;
        return active == route.active &&
                routeId.equals(route.routeId) &&
                truck.equals(route.truck) &&
                routeName.equals(route.routeName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(routeId, truck, routeName, active);
    }
}
