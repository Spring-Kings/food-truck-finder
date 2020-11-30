import * as t from 'io-ts'
import DateMeta from "../metaclasses/DateMeta";

export const ReviewMeta = t.type({
  reviewId: t.number,
  userId: t.number,
  truckId: t.number,

  username: t.string,
  starRating: t.number,
  costRating: t.number,
  review: t.union([t.string, t.null]),
  timestamp: DateMeta
}, "Review")

export type Review = t.TypeOf<typeof ReviewMeta>

export const isExtended = (r: Review) => r.review == null;

export type TruckReviews = {
  reviews: Review[];

  // Truck bookkeeping info
  truckName: string;
  avgStarRating: number | null;
  avgCostRating: number | null;
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

export function backendToFrontend(obj: any, username: string): any {
  return {
    ...obj,
    reviewId: obj.id,
    timestamp: new Date(obj.day_time),
    truckId: obj.truckId,
    review: obj.reviewText,
    username
  }
}

export function frontendToBackend(r: Review): any {
  return {
    ...r,
    review: r.review ?? ""
  }
}

export default Review;
