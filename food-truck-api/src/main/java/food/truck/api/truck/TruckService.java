package food.truck.api.truck;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import food.truck.api.Position;
import food.truck.api.routes.Route;
import food.truck.api.routes.RouteLocation;
import food.truck.api.routes.RouteRepository;
import food.truck.api.routes.RouteService;
import food.truck.api.security.SecurityConstants;
import food.truck.api.user.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
public class TruckService {
    @Autowired
    private TruckRepository truckRepository;
    @Autowired
    private RouteService routeService;
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private AmazonS3 s3Client;

    public List<Truck> findTruck(String name) {
        return truckRepository.findByName(name);
    }

    public List<Truck> findTruck(Long userId) {
        return truckRepository.findByUserId(userId);
    }

    public Optional<Truck> findTruckById(Long truckId) {
        return truckRepository.findById(truckId);
    }

    public Truck saveTruck(Truck truck) {
        return truckRepository.save(truck);
    }

    public Truck createTruck(Long userId, String name) {
        var t = new Truck();
        t.setName(name);
        t.setUserId(userId);
        t.setDescription("");
        t.setTags(new HashSet<>());
        return saveTruck(t);
    }

    public void deleteTruck(long truckId) {
        var t = truckRepository.findById(truckId);
        if (t.isEmpty())
            return;
        Truck truck = t.get();
        routeService.findRouteByTruck(truck)
                .forEach(r -> routeService.deleteRoute(r.getRouteId()));
        truckRepository.delete(truck);
    }

    public Truck updateTruck(
            long truckId,
            Optional<String> name,
            Optional<Double> priceRating,
            Optional<String> description,
            Optional<Set<String>> tags
    ) {
        var t = findTruckById(truckId);
        if (t.isEmpty())
            return null;
        var truck = t.get();
        name.ifPresent(truck::setName);
        if (truck.getPriceRating() == null)
            truck.setPriceRating(priceRating.orElse(null));
        truck.setDescription(description.orElse(null));

        // Ensure all tags are unique and lowercase and have no whitespace at start/end
        if (tags.isPresent()) {
            var tags2 = tags.get().stream()
                    .map(tag -> tag.toLowerCase().trim())
                    .filter(tag -> !tag.isEmpty())
                    .collect(Collectors.toSet());
            truck.setTags(tags2);
        }
        return saveTruck(truck);
    }

    public Route getActiveRoute(long truckId, DayOfWeek w) {
        return routeRepository.findByTruckId(truckId).stream()
                .filter(r -> r.isActive() && r.getDays().contains(w))
                .findFirst()
                .orElse(null);
    }

    public Route getActiveRoute(long truckId) {
        return getActiveRoute(truckId, OffsetDateTime.now(ZoneOffset.UTC).getDayOfWeek());
    }

    public Optional<RouteLocation> getCurrentRouteLocation(long truckId) {
        var route = getActiveRoute(truckId);
        if (route == null)
            return Optional.empty();

        return routeService.getCurrentRouteLocation(route.getRouteId());
    }

    public List<Truck> getTrucksCloseToLocation(Position loc, double radiusMiles) {
        return truckRepository.findAll().stream().filter(truck -> {
                    var curLoc = getCurrentRouteLocation(truck.id);
                    if (curLoc.isEmpty())
                        return false;
                    var truckLocation = curLoc.get().getPosition();
                    double distance = loc.distanceInMiles(truckLocation);
                    return distance < radiusMiles;
                }
        ).collect(Collectors.toList());
    }

    public boolean userOwnsTruck(User u, long truckId) {
        var t = findTruckById(truckId);
        return t.isPresent() && t.get().getUserId().equals(u.getId());
    }

    public HttpStatus tryUploadMenu(long truckId, MultipartFile file) {
        var truck = findTruckById(truckId);
        if (truck.isEmpty())
            return HttpStatus.NOT_FOUND;

        var t = truck.get();

        if (file.getContentType() == null)
            return HttpStatus.BAD_REQUEST;

        String contentType = file.getContentType();
        try {
            MediaType.parseMediaType(contentType);
        } catch (InvalidMediaTypeException e) {
            return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
        }
        if (!contentType.startsWith("image/") && !contentType.equals("application/pdf")) {
            return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
        }

        if (file.getSize() == 0)
            return HttpStatus.BAD_REQUEST;
        if (file.getSize() > SecurityConstants.MAX_UPLOAD_SIZE) {
            return HttpStatus.PAYLOAD_TOO_LARGE;
        }

        var fileObjKeyName = "menu/" + truckId;
        var bucketName = System.getenv("S3_BUCKET_NAME");
        try {
            var metadata = new ObjectMetadata();
            metadata.setContentType(contentType);
            metadata.setContentLength(file.getBytes().length);
            var request = new PutObjectRequest(bucketName, fileObjKeyName, file.getInputStream(), metadata);
            s3Client.putObject(request);
        } catch (IOException e) {
            log.info("Couldn't upload menu", e);
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        t.setMenuContentType(contentType);
        saveTruck(t);
        return HttpStatus.OK;
    }
}
