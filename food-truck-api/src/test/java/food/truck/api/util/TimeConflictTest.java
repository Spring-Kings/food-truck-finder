package food.truck.api.util;

import food.truck.api.routes.RouteLocation;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TimeConflictTest {

    private static RouteLocation makeLoc(int arrivHr, int arrivMin, int exitHr, int exitMin) {
        return new RouteLocation(1, null, LocalTime.of(arrivHr, arrivMin), LocalTime.of(exitHr, exitMin), null);
    }

    @Test
    public void firstBeforeSecondNoConflict() {
        var loc1 = makeLoc(2, 0, 3, 0);
        var loc2 = makeLoc(4, 0, 5, 0);
        assertFalse(loc1.timeConflictsWith(loc2));
    }

    @Test
    public void secondBeforeFirstNoConflict() {
        var loc1 = makeLoc(4, 0, 5, 0);
        var loc2 = makeLoc(2, 0, 3, 0);
        assertFalse(loc2.timeConflictsWith(loc1));
    }

    @Test
    public void normalConflict() {
        var loc1 = makeLoc(2, 30, 3, 30);
        var loc2 = makeLoc(3, 0, 4, 0);
        assertTrue(loc1.timeConflictsWith(loc2));
    }

    @Test
    public void firstWrapsConflict() {
        var loc1 = makeLoc(23, 0, 5, 0);
        var loc2 = makeLoc(4, 0, 8, 0);
        assertTrue(loc1.timeConflictsWith(loc2));
    }

    @Test
    public void firstWrapsNoConflict() {
        var loc1 = makeLoc(23, 0, 5, 0);
        var loc2 = makeLoc(7, 0, 8, 0);
        assertFalse(loc1.timeConflictsWith(loc2));
    }

    @Test
    public void secondWrapsConflict() {
        var loc2 = makeLoc(23, 0, 5, 0);
        var loc1 = makeLoc(4, 0, 8, 0);
        assertTrue(loc1.timeConflictsWith(loc2));
    }

    @Test
    public void secondWrapsNoConflict() {
        var loc2 = makeLoc(23, 0, 5, 0);
        var loc1 = makeLoc(7, 0, 8, 0);
        assertFalse(loc1.timeConflictsWith(loc2));
    }

    @Test
    public void bothWrapConflict() {
        var loc1 = makeLoc(23, 0, 5, 0);
        var loc2 = makeLoc(23, 30, 4, 0);
        assertTrue(loc1.timeConflictsWith(loc2));
    }


}
