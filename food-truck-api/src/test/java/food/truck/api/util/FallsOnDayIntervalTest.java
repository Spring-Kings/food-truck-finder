package food.truck.api.util;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.time.LocalTime;
import java.util.stream.Stream;

import static java.time.LocalTime.parse;
import static food.truck.api.routes.RouteService.fallsOnDayInterval;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Test the active route selection method.
 *
 * As always, I have to fall back to Dr. Cerny's Software I slides
 * to remind me how to create parameterized tests. I cached all of
 * those things for a reason.
 */
public class FallsOnDayIntervalTest {
    @ParameterizedTest(name = "{index} => now={0}, start={1}, end={2}, onInterval={3}")
    @MethodSource("timeIntervalProvider")
    void timeIntervalTest(LocalTime now, LocalTime start, LocalTime end, boolean onInterval) {
        assertEquals(onInterval, fallsOnDayInterval(now, start, end));
    }

    /**
     * Generate test cases:
     * Not spanning midnight, not on interval
     * Not spanning midnight, on interval
     * Spanning midnight, not on interval
     * Spanning midnight, on interval
     * @return A stream of test case arguments
     */
    @SuppressWarnings("unused")
    private static Stream<Arguments> timeIntervalProvider() {
        return Stream.of(
                Arguments.of(parse("11:00:00"), parse("12:00:00"), parse("20:00:00"), false),
                Arguments.of(parse("11:00:00"), parse("12:00:00"), parse("11:30:00"), true),
                Arguments.of(parse("11:00:00"), parse("01:00:00"), parse("05:00:00"), false),
                Arguments.of(parse("11:00:00"), parse("01:00:00"), parse("20:00:00"), true)
        );
    }
}
