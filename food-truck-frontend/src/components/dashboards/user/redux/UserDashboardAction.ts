// UserDashboard's redux name
export const userDashboardName = "userDashboard";

// Action types--flags used to ID which action was received--go here.
// NOTE: must be prepended with the above name for some Redux automation to work.
export enum UserDashboardActionTypes {
  ADD_TRUCK_ACTION = "userDashboard/add"
};

// Aggregate action type; | all action types together
export type UserDashboardAction = AddTruckAction;

// Actions used by this part of the program
export interface AddTruckAction {
  type: UserDashboardActionTypes.ADD_TRUCK_ACTION;
  payload: string;
}
