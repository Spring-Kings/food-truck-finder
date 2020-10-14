package food.truck.api.routes;

import lombok.Data;

import javax.persistence.*;

@Data
@Table(name="route_days")
public class RouteDays {

    @JoinColumn(foreignKey = @ForeignKey(name = "route_id"), nullable = false)
    Long routeId;

    @Column(name="day", nullable = false)
    Long day;

}
