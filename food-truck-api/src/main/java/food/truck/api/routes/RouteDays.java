package food.truck.api.routes;

import lombok.Data;

import javax.persistence.*;

enum Days{
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}

@Data
@Entity
@Table(name="route_days")
public class RouteDays {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_days_id", nullable = false)
    Long routeDaysId;

    @JoinColumn(foreignKey = @ForeignKey(name = "route_id"), nullable = false)
    Long routeId;

    @Column(name="day", nullable = false)
    Long day;

}
