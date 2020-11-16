import {ThemeData} from "./ThemeReducer";

export const themeReduxName = "theme";
export enum ThemeActionTypes {
  SWITCH_THEME = "theme/switch",
}

export type ThemeAction = SwitchThemeAction;

export interface SwitchThemeAction {
  type: ThemeActionTypes.SWITCH_THEME;
  payload: ThemeData;
}
