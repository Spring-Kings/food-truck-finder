package food.truck.api.user;

import lombok.Data;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    Long id;

    @Column(name = "username", nullable = false, unique = true)
    String username;

    @Column(name = "email", nullable = false)
    String email;

    @Column(name = "hashed_password", nullable = false)
    String password;

    @Column(name = "token", nullable = true)
    String token;

    @Column(name = "token_expiry", nullable = true)
    OffsetDateTime tokenExpiry;
}
