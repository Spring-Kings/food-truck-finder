interface Review {
  // Administrative stuff
  reviewId: number;
  userId: number;
  truckId: number;

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
    username: "",
    starRating: 0,
    costRating: 0,
    review: "",
    timestamp: new Date(),
  };
}

export function backendToFrontend(obj: any, username: string): Review {
  return {
    reviewId: obj.reviewId,
    userId: obj.userId,
    truckId: obj.truckId,
    starRating: obj.starRating,
    costRating: obj.costRating,
    review: obj.reviewText,
    timestamp: obj.timestamp,
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
    review: review.review,
    timestamp: review.timestamp,
  };
}

export default Review;
