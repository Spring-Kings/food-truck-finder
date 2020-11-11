package food.truck.api;

import lombok.extern.log4j.Log4j2;

import javax.persistence.AttributeConverter;

@Log4j2
public class PositionConverter implements AttributeConverter<Position, String> {
    @Override
    public String convertToDatabaseColumn(Position l) {
        return l.getLatitude() + "," + l.getLongitude();
    }

    @Override
    public Position convertToEntityAttribute(String dbData) {
        var split = dbData.split(",");
        if (split.length != 2)
            return null;
        try {
            double lat = Double.parseDouble(split[0]);
            double lng = Double.parseDouble(split[1]);
            return new Position(lat, lng);
        } catch (NumberFormatException e) {
            log.debug("Couldn't parse location in DB");
            return null;
        }
    }
}
