interface Review {
  // Administrative stuff
  reviewId: number;
  userId: number;
  truckId: number;
  extended: boolean | undefined;

  // Information of interest to users
  username: string;
  starRating: number;
  costRating: number;
  review: string;
  timestamp: Date;
}

export function emptyReview(userId: number, truckId: number): Review {
  return {
    reviewId: -1,
    userId,
    truckId,
    extended: false,
    username: "",
    starRating: 0,
    costRating: 0,
    review: "",
    timestamp: new Date(),
  };
}

export function backendToFrontend(obj: any, username: string): Review {
  return {
    reviewId: obj.id,
    userId: obj.userId,
    truckId: obj.truck.id,
    extended: obj.reviewText? obj.reviewText.length > 0 : false,
    starRating: obj.starRating,
    costRating: obj.costRating,
    review: obj.reviewText,
    timestamp: new Date(obj.day_time),
    username,
  };
}

export function frontendToBackend(review: Review): any {
  return {
    reviewId: review.reviewId,
    userId: review.userId,
    truckId: review.truckId,
    starRating: review.starRating,
    costRating: review.costRating,
    review: (review.extended? review.review : ""),
    timestamp: review.timestamp,
  };
}

export default Review;
