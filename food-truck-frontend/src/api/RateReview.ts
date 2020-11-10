import Review, { backendToFrontend as review_backendToFrontend, TruckReviews } from "../domain/truck/Review";
import Truck, { backendToFrontend as truck_backendToFrontend } from "../domain/truck/Truck";
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
        return review_backendToFrontend(r, name.data.username);
      });
    }
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    reviews = [];
    if (onFail) onFail(e);
  }

  return reviews;
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
) => {
  let review: Review | null = null;
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
        url: `/reviews/truck/${truckId}/user`,
        params: {
          userId: userId
        },
        method: "GET",
      });

      // Map review to a frontend review
      if (resp.data !== null)
        review = review_backendToFrontend(resp.data, name.data.username);
    }
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return null
    review = null;
    if (onFail) onFail(e);
  }

  return review;
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
  let reviews: TruckReviews = {
    reviews: [],
    avgCostRating: null,
    avgStarRating: null,
    truckName: ""
  };

  try {
    // Get the reviews for this truck
    let resp: any = await api.request({
      url: `/reviews/truck/${truckId}`,
      method: "GET",
    });

    // If we got a good response, then create frontend representation
    if (resp.data !== null) {
      // Map all backend reviews to frontend reviews
      // Learned to use `Promise.all` from: https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
      reviews.reviews = await Promise.all(resp.data.map(async (r: any) => {
        // Fetch username
        let name: any = await api.request({
          url: `/user/${r.userId}`,
          method: "GET",
        });
        
        // Create frontend representation for 1 review, with either the username or a blank string
        return review_backendToFrontend(
          r,
          name.data !== null ? name.data.username : ""
        );
      }));
    }

    // Fetch the truck's info. Yes, I could've gotten it from the reviews. That seemed like a coupling hazard, what happens
    // if we change the way reviews get stored and they suddenly don't store trucks directly?
    let truck: Truck | null = truck_backendToFrontend((await api.request({
      url: `/truck/${truckId}`,
      method: "GET"
    })).data);
    console.log(truck);
    if (truck !== null) {
      reviews.truckName = truck.name;
      reviews.avgCostRating = truck.priceRating;
      reviews.avgStarRating = truck.starRating;
    }
  } catch (e: any) {
    // Derp. Handle failure as the client requested and return an empty list
    reviews.reviews = [];
    if (onFail) onFail(e);
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
