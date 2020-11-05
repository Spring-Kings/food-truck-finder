package food.truck.api.user;

import food.truck.api.Location;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Guest extends AbstractUser {
    public Guest(Location loc) {
        location = loc;
    }

    public void visit(UserVisitor v) {
        v.accept(this);
    }
}
