package food.truck.api.routes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import food.truck.api.Position;
import food.truck.api.PositionConverter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalTime;


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
    LocalTime arrivalTime;

    @Column(name = "exit_time", nullable = false)
    LocalTime exitTime;

    @Convert(converter = PositionConverter.class)
    @Column(nullable = false)
    Position position;

    @JsonIgnore
    public boolean wrapsAroundMidnight() {
        return exitTime.isBefore(arrivalTime);
    }

    // I have no idea how I came up with this but the tests seem to work
    // 4 cases, depending on which locations wrap around midnight (UTC)
    public boolean timeConflictsWith(RouteLocation other) {
        if (!wrapsAroundMidnight() && !other.wrapsAroundMidnight())
            return !arrivalTime.isAfter(other.exitTime) && !exitTime.isBefore(other.arrivalTime);
        else if (wrapsAroundMidnight() && !other.wrapsAroundMidnight())
            return !exitTime.isBefore(other.arrivalTime) || !arrivalTime.isAfter(other.exitTime);
        else if (!wrapsAroundMidnight() && other.wrapsAroundMidnight())
            return !arrivalTime.isAfter(other.exitTime) || !exitTime.isBefore(other.arrivalTime);
        else
            return true; // If both wrap around, that means they conflict at midnight
    }
}
