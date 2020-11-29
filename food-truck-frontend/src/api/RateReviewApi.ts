import Review, {backendToFrontend as review_backendToFrontend, ReviewMeta, TruckReviews} from "../domain/Review";
import api from "../util/api";
import {ClientResponseAction} from "./ResponseTypes";
import {getUsername} from "./UserApi";
import {parse} from "../util/type-checking";
import {getTruckById} from "./TruckApi";

/**
 * Get all reviews by a particular user
 * @param userId The ID of the user to load
 * @param onFail An optional response to the API request failing
 */
export const loadReviewsByUser = async (
  userId: number,
  onFail?: ClientResponseAction
): Promise<Review[] | null> => {
  let reviews: Review[] = [];

  try {
    // Fetch username
    let name = await getUsername(userId);
    if (name === null)
      throw 'User not found';

    // Get the reviews by this user
    let resp: any = await api.request({
      url: `/reviews/user/${userId}`,
      method: "GET",
    });

    // Map all backend reviews to frontend reviews
    return resp.data
      .map((r: any) => parse(ReviewMeta, review_backendToFrontend(r, name.data)))
      .filter(r => r != null)
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    if (onFail) onFail(e);
  }

  return null;
};

/**
 * Get the review on a truck by a particular user
 * @param truckId The ID of the truck to load the review for
 * @param userId The ID of the user to load the review from
 * @param onFail An optional response to the API request failing
 */
export const loadReviewFromTruckForUser = async (
  truckId: number,
  userId: number,
  onFail?: ClientResponseAction
): Promise<Review | null> => {
  try {
    // Fetch username
    let name = await getUsername(userId);
    if (name === null)
      throw 'User not found';

    // Get the reviews by this user
    let resp: any = await api.request({
      url: `/reviews/truck/${truckId}/user`,
      params: {
        userId: userId
      },
      method: "GET",
    });

    return parse(ReviewMeta, review_backendToFrontend(resp.data, name.data));

  } catch (e: any) {
    // Derp. Handle failure as the client requested and return null
    if (onFail) onFail(e);
  }

  return null;
};

/**
 * Get all reviews for a specific truck
 * @param truckId The ID of the truck with reviews to retrieve
 * @param onFail An optional response to the API request failing
 */
export const loadReviewsByTruck = async (
  truckId: number,
  onFail?: ClientResponseAction
): Promise<TruckReviews | null> => {
  try {
    // Get the reviews for this truck
    let resp: any = await api.request({
      url: `/reviews/truck/${truckId}`,
      method: "GET",
    });

    if (resp.data == null)
      throw 'Truck not found';

    // Map all backend reviews to frontend reviews
    // Learned to use `Promise.all` from: https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
    const promises = resp.data.map(async (r) => {
      const name = await getUsername(r.userId) ?? throw 'User not found';
      const rev: Review | null = parse(ReviewMeta, review_backendToFrontend(r, name))
      return rev;
    })

    const reviews: Review[] = await Promise.all(promises)
      .filter(r => r != null);
    const truck = await getTruckById(truckId)
    if (truck !== null) {
      return {
        reviews,
        truckName: truck.name,
        avgCostRating: truck.priceRating,
        avgStarRating: truck.starRating
      }
    }
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    if (onFail) onFail(e);
  }

  return null;
};

/**
 * Generate the URL for leaving a truck review. Allows use of the Form component
 * @param truckId ID of the truck to review
 */
export const getSaveReviewUrl = (truckId: number) => `/reviews/truck/${truckId}`;

/**
 * Create a new review/update an old review for a truck.
 * @param review The frontend representation of the review to post
 * @param onSuccess An optional response to the API request succeeding
 * @param onFail An optional response to the API request failing
 */
export const reviewTruck = async (
  review: Review,
  onSuccess?: ClientResponseAction,
  onFail?: ClientResponseAction
) => {
  await api
    .request({
      url: `/reviews/truck/${review.truckId}`,
      data: review,
      method: "POST",
    })
    .then(onSuccess)
    .catch(onFail);
  return review;
};

/**
 * Delete a review on a specified truck for this User
 * @param truckId The ID of the truck with a review to delete
 * @param onFail An optional response to the API request failing
 */
export const deleteReview = async (
  truckId: number,
  onFail?: ClientResponseAction
) => {
  let result: boolean = false;
  await api
    .request({
      url: `/reviews/truck/${truckId}`,
      method: "DELETE",
    })
    .then((resp) => {
      if (resp.data !== undefined) result = resp.data;
    })
    .catch(onFail);
  return result;
};


export const loadReviewById = async (reviewId: number): Promise<Review | null> => {
  const response = await api.get(`/reviews/${reviewId}`);
  if (response.data?.userId) {
    const usernameResp = await getUsername(response.data.userId);
    return parse(ReviewMeta, review_backendToFrontend(response.data, usernameResp.data));
  }

  return null;
}