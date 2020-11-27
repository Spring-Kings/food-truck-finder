package food.truck.api.endpoint;

import com.amazonaws.services.s3.AmazonS3;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import food.truck.api.FoodTruckApplication;
import food.truck.api.routes.RouteService;
import food.truck.api.truck.TruckService;
import food.truck.api.user.UserService;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest(classes = FoodTruckApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Transactional
@Log4j2
@AutoConfigureMockMvc
public class EndpointTest {
    @Autowired
    protected TestData data;
    @MockBean
    protected AmazonS3 s3Client;
    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected UserService userService;
    @Autowired
    protected TruckService truckService;
    @Autowired
    protected RouteService routeService;
    @LocalServerPort
    private int port;

    private static final ObjectMapper mapper = makeMapper();

    private static ObjectMapper makeMapper() {
        var m = new ObjectMapper();
        m.registerModule(new JavaTimeModule());
        m.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
        return m;
    }

    // Use @SneakyThrows because we don't care about gracefully handling exception, just
    // making the test fail with an exception is fine
    @SneakyThrows
    protected static String asJson(Object obj) {
        return new ObjectMapper().writeValueAsString(obj);
    }

    @SneakyThrows
    protected static <T> T fromJson(String str, Class<T> clazz) {
        return mapper.readValue(str, clazz);
    }

    @SneakyThrows
    protected static <T> List<T> fromJsonList(String str, Class<T> clazz) {
        var reader = mapper.readerFor(clazz);
        return reader.<T>readValues(str).readAll();
    }

    @BeforeEach
    public void reloadFromDb() {
        data.reloadFromDb();
    }

}