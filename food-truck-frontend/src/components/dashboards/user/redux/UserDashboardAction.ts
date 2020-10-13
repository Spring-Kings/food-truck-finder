import UserSubscription from "../../../../domain/Subscription";
import { UserDashboardData } from "../react/UserDashboardProps";

// UserDashboard's redux name
export const userDashboardName = "userDashboard";

// Action types--flags used to ID which action was received--go here.
// NOTE: must be prepended with the above name for some Redux automation to work.
export enum UserDashboardActionTypes {
  LOAD_SUBS_ACTION = "userDashboard/fetchSub",
  LOAD_PROPS_ACTION = "userDashboard/load",
}

// Aggregate action type; | all action types together
export type UserDashboardAction = LoadSubscriptionsAction | LoadPropsAction;

export interface LoadSubscriptionsAction {
  type: UserDashboardActionTypes.LOAD_SUBS_ACTION;
  payload: UserSubscription[];
}

export interface LoadPropsAction {
  type: UserDashboardActionTypes.LOAD_PROPS_ACTION;
  payload: UserDashboardData;
}
