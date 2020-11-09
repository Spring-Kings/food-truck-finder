package food.truck.api.util;

import food.truck.api.Position;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

// TODO: More rigorous testing for distance
public class PositionTest {
    @Test
    public void TestMoodyLibraryToCashion() {
        // Cashion:  31.545837, -97.118053
        // Moody: 31.548480, -97.117636
        // Should be about 0.2965km or 0.184 mi.
        var pt1 = new Position(31.545837, -97.118053);
        var pt2 = new Position(31.548480, -97.117636);
        assertEquals(0.184, pt1.distanceInMiles(pt2), 0.05);
    }
}
