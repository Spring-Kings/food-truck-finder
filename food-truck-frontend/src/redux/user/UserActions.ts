import { UserData } from "./UserReducer";

export const userReduxName = "user";
export enum UserActionTypes {
  LOAD_USER_ACTION = "user/load",
}

// Aggregate action type; | all action types together
export type UserAction = LoadUserAction;

export interface LoadUserAction {
  type: UserActionTypes.LOAD_USER_ACTION;
  payload: UserData;
}
