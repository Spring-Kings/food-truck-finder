package food.truck.api.user;

public interface UserVisitor {
    public void accept(User u);
    public void accept(Guest g);
    public void accept(AbstractUser au);
}
