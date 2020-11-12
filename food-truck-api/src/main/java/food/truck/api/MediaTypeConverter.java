package food.truck.api;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;

import javax.persistence.AttributeConverter;

@Log4j2
public class MediaTypeConverter implements AttributeConverter<MediaType, String> {
    @Override
    public String convertToDatabaseColumn(MediaType attribute) {
        if (attribute == null)
            return null;
        return attribute.toString();
    }

    @Override
    public MediaType convertToEntityAttribute(String dbData) {
        if (dbData == null)
            return null;
        try {
            return MediaType.parseMediaType(dbData);
        } catch (InvalidMediaTypeException e) {
            log.warn("Invalid media type");
            return null;
        }
    }
}
