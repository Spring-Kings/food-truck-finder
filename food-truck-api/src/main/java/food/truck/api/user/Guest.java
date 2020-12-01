package food.truck.api.user;

import food.truck.api.Position;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Guest extends AbstractUser {
    public Guest(Position loc) {
        position = loc;
    }

    public void visit(UserVisitor v) {
        v.accept(this);
    }

    @Override
    public boolean canView(User u) {
        return u.privacySetting == PrivacySetting.PUBLIC;
    }
}
