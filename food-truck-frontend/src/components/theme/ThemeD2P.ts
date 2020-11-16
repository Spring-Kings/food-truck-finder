import {Dispatch} from "redux";
import {ThemeAction, ThemeActionTypes} from "../../redux/theme/ThemeActions";

function storedThemeIsDark(): boolean {
  const theme: string | null = localStorage.getItem("ftfTheme");
  return theme === "DARK";
}

function switchTheme(
  dispatch: Dispatch<ThemeAction>,
) {
  const isDark: boolean = storedThemeIsDark();
  dispatch({
    type: ThemeActionTypes.SWITCH_THEME,
    payload: { isDark: !isDark }
  });
  const themeStr: string = !isDark ? "DARK" : "LIGHT";
  localStorage.setItem("ftfTheme", themeStr);
}

function loadTheme(
  dispatch: Dispatch<ThemeAction>,
) {
  const isDark: boolean = storedThemeIsDark();
  dispatch({
    type: ThemeActionTypes.SWITCH_THEME,
    payload: { isDark: isDark }
  });
}

const mapDispatchToProps = (dispatch: Dispatch<ThemeAction>) => {
  return {
    switchTheme: () => {
      switchTheme(dispatch);
    },
    loadTheme: () => {
      loadTheme(dispatch);
    },
    dispatch,
  };
};

export default mapDispatchToProps;