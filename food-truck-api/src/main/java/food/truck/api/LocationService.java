package food.truck.api;

import com.maxmind.geoip2.DatabaseReader;
import org.springframework.stereotype.Service;

@Service
public class LocationService {
    private DatabaseReader reader;

    public LocationService() {

    }

    public Location estimateLocation(String remoteAddress) {

    }
}
