import { createSlice } from '@reduxjs/toolkit';
import {SwitchThemeAction, ThemeActionTypes, themeReduxName} from "./ThemeActions";

export interface ThemeData {
  isDark: boolean;
}

const themeSlice = createSlice({
  name: themeReduxName,
  initialState: {
    data: {
      isDark: false,
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(ThemeActionTypes.SWITCH_THEME, (state: { data: ThemeData }, action: SwitchThemeAction) => {
      state.data = action.payload;
      return state;
    });
  }
});

export default themeSlice;