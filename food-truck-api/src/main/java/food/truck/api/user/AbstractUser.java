package food.truck.api.user;

import food.truck.api.Location;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AbstractUser {
    protected Location location;

    public void visit(UserVisitor v) {
        v.accept(this);
    }
}
