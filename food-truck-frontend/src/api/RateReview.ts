import Review, { backendToFrontend } from "../domain/truck/Review";
import api from "../util/api";
import { ClientResponseAction } from "./ResponseTypes";

/**
 * Get all reviews by a particular user
 * @param userId The ID of the user to load
 * @param onFail An optional response to the API request failing
 */
export const loadReviewsByUser = async (
  userId: number,
  onFail?: ClientResponseAction
) => {
  let reviews: Review[] = [];

  try {
    // Fetch username
    let name: any = await api.request({
      url: `/user/${userId}`,
      method: "GET",
    });

    // If we got a good response, then this user exists; create frontend representation of reviews
    if (name.data !== null) {
      // Get the reviews by this user
      let resp: any = await api.request({
        url: `/reviews/truck/${userId}`,
        method: "GET",
      });

      // Map all backend reviews to frontend reviews
      reviews = resp.data.map(async (r: any) => {
        // Create frontend representation for 1 review, with either the username or a blank string
        return backendToFrontend(r, name.data.username);
      });
    }
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    if (onFail) onFail(e);
    reviews = [];
  }

  return reviews;
};

/**
 * Get all reviews for a specific truck
 * @param truckId The ID of the truck with reviews to retrieve
 * @param onFail An optional response to the API request failing
 */
export const loadReviewsByTruck = async (
  truckId: number,
  onFail?: ClientResponseAction
) => {
  let reviews: Review[] = [];

  try {
    // Get the reviews for this truck
    let resp: any = await api.request({
      url: `/reviews/truck/${truckId}`,
      method: "GET",
    });

    // If we got a good response, then create frontend representation
    if (resp.data !== null)
      // Map all backend reviews to frontend reviews
      reviews = resp.data.map(async (r: any) => {
        // Fetch username
        let name: any = await api.request({
          url: `/user/${r.userId}`,
          method: "GET",
        });

        // Create frontend representation for 1 review, with either the username or a blank string
        return backendToFrontend(
          r,
          name.data !== null ? name.data.username : ""
        );
      });
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    if (onFail) onFail(e);
    reviews = [];
  }

  return reviews;
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
  var result: boolean = false;
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
