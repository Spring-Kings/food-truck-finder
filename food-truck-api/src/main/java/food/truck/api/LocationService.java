package food.truck.api;

import com.maxmind.db.CHMCache;
import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.InetAddress;

@Service
public class LocationService {
    private DatabaseReader reader;

    @PostConstruct
    private void init() throws IOException {
        var stream = LocationService.class.getClassLoader().getResourceAsStream("GeoLite2-City.mmdb");
        reader = new DatabaseReader.Builder(stream).withCache(new CHMCache()).build();
    }

    public Location estimateLocation(HttpServletRequest request) throws IOException, GeoIp2Exception {
        return estimateLocation(InetAddress.getByName(request.getRemoteAddr()));
    }

    public Location estimateLocation(InetAddress addr) throws IOException, GeoIp2Exception {
        var loc = reader.city(addr).getLocation();
        return new Location(loc.getLatitude(), loc.getLongitude());
    }
}
