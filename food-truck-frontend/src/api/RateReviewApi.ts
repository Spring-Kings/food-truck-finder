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
  onFail: ClientResponseAction = console.log
): Promise<Review[] | null> => {

  try {
    // Fetch username
    let name = await getUsername(userId);
    if (name == null) {
      onFail("User not found");
      return null;
    }

    // Get the reviews by this user
    let resp: any = await api.request({
      url: `/reviews/user/${userId}`,
      method: "GET",
    });

    // Map all backend reviews to frontend reviews
    return resp.data
      .map((r: any) => parse(ReviewMeta, review_backendToFrontend(r, name as string)))
      .filter((r: Review | null) => r != null)
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    onFail(e);
  }

  onFail("Couldn't load reviews by user")
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
  onFail: ClientResponseAction = console.log
): Promise<Review | null> => {
  try {
    // Fetch username
    let name = await getUsername(userId);
    if (name === null) {
      onFail('User not found');
      return null;
    }

    // Get the reviews by this user
    let resp: any = await api.request({
      url: `/reviews/truck/${truckId}/user`,
      params: {
        userId: userId
      },
      method: "GET",
    });

    return parse(ReviewMeta, review_backendToFrontend(resp.data, name));

  } catch (e: any) {
    // Derp. Handle failure as the client requested and return null
    onFail(e);
  }
  if (onFail)
    onFail("Failed to load review for user")
  return null;
};

/**
 * Get all reviews for a specific truck
 * @param truckId The ID of the truck with reviews to retrieve
 * @param onFail An optional response to the API request failing
 */
export const loadReviewsByTruck = async (
  truckId: number,
  onFail: ClientResponseAction = console.log
): Promise<TruckReviews | null> => {
  try {
    // Get the reviews for this truck
    let resp: any = await api.request({
      url: `/reviews/truck/${truckId}`,
      method: "GET",
    });

    if (resp.data == null) {
      onFail('Truck not found');
      return null;
    }

    // Map all backend reviews to frontend reviews
    // Learned to use `Promise.all` from: https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
    const promises: Promise<Review | null>[] = resp.data.map(async (r: any) => {
      const name = await getUsername(r.userId)
      if (!name) {
        onFail('User not found')
        return null;
      }
      const rev: Review | null = parse(ReviewMeta, review_backendToFrontend(r, name))
      return rev;
    })

    const reviews: Review[] = (await Promise.all(promises))
      .filter(r => r != null) as Review[];

    const truck = await getTruckById(truckId, () => {
    })
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
    onFail(e);
  }
  onFail("Failed to load reviews for truck")
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
  onFail: ClientResponseAction = console.log
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
  onFail: ClientResponseAction = console.log
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


export const loadReviewById = async (reviewId: number, onFail: (e) => void = console.log): Promise<Review | null> => {
  try {
    const response = await api.get(`/reviews/${reviewId}`);
    if (response.data?.userId) {
      const username = await getUsername(response.data.userId);
      if (!username)
        return null;
      return parse(ReviewMeta, review_backendToFrontend(response.data, username));
    }
  } catch (e) {
    onFail(e)
    return null;
  }
  onFail("Failed to load review by ID")
  return null;
}