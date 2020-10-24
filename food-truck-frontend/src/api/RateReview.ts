import Review, { emptyReview } from "../domain/truck/Review";
import api from "../util/api";
import { ClientResponseAction } from "./ResponseTypes";

export const loadReviewsByTruck = async (
  truckId: number,
  onSuccess?: ClientResponseAction,
  onFail?: ClientResponseAction
) => {
  let reviews: Review[] = [];
  await api
    .request({
      url: `/truck/${truckId}/reviews`,
      method: "GET",
    })
    .then((resp: any) => {
        if (resp.data !== null)
            review = resp.data;
    })
    .catch(onFail);
  return review;
};

export const createReview = async (
  review: Review,
  onSuccess?: ClientResponseAction,
  onFail?: ClientResponseAction
) => {
  await api
    .request({
      url: `/truck/${review.truckId}/reviews`,
      data: review,
      method: "POST",
    })
    .then(onSuccess)
    .catch(onFail);
  return review;
};
