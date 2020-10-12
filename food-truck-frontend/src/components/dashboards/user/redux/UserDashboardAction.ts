import { Subscription } from "final-form";
import UserSubscription from "../../../../domain/Subscription";

// UserDashboard's redux name
export const userDashboardName = "userDashboard";

// Action types--flags used to ID which action was received--go here.
// NOTE: must be prepended with the above name for some Redux automation to work.
export enum UserDashboardActionTypes {
  LOAD_SUBS_ACTION = "userDashboard/fetchSub"
};

// Aggregate action type; | all action types together
export type UserDashboardAction = LoadSubscriptionsAction;

export interface LoadSubscriptionsAction {
  type: UserDashboardActionTypes.LOAD_SUBS_ACTION
  payload: UserSubscription[]
};
