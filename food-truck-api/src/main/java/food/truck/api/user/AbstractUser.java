package food.truck.api.user;

import food.truck.api.Position;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AbstractUser {
    protected Position position;

    public void visit(UserVisitor v) {
        v.accept(this);
    }
}
