package food.truck.api.user;

public interface UserVisitor {
    void accept(User u);

    void accept(Guest g);

    void accept(AbstractUser au);
}
