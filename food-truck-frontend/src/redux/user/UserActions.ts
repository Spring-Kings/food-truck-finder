import { UserData } from "./UserReducer";

export const userReduxName = "user";
export enum UserActionTypes {
  LOAD_USER_ACTION = "user/load",
  LOGOUT_USER_ACTION = "user/logout"
}

// Aggregate action type; | all action types together
export type UserAction = LoadUserAction | LogoutUserAction;

export interface LoadUserAction {
  type: UserActionTypes.LOAD_USER_ACTION;
  payload: UserData;
}

export interface LogoutUserAction {
  type: UserActionTypes.LOGOUT_USER_ACTION;
}
