package food.truck.api.user;

import food.truck.api.Position;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class AbstractUser {
    protected Position position;

    public void visit(UserVisitor v) {
        v.accept(this);
    }
    public abstract boolean canView(User u);
}
