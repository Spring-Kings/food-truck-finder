package food.truck.api.recommendation;

enum ScoreWeights {
    DistWeight(3.0),
    PriceWeight(1.5),
    TagWeight(10.0),
    RatingWeight(5.0),
    SubscriptionWeight(10.0),
    SubscibedToDifferentTruckWithSameOwnerWeight(3.0);

    public final double val;

    ScoreWeights(double val) {
        this.val = val;
    }
}