import {Dispatch} from "redux";
import {ThemeAction, ThemeActionTypes} from "../../redux/theme/ThemeActions";

function getStoredTheme(): boolean {
  const theme: string | null = localStorage.getItem("ftfTheme");
  return theme === "DARK";
}

function switchTheme(
  dispatch: Dispatch<ThemeAction>,
) {
  const isDark: boolean = getStoredTheme();
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
  const isDark: boolean = getStoredTheme();
  dispatch({
    type: ThemeActionTypes.SWITCH_THEME,
    payload: { isDark: isDark }
  });
}

const mapDispatchToProps = (dispatch: Dispatch<ThemeAction>) => {
  return {
    switchTheme: () => {
      return new Promise<void>(() => {
        switchTheme(dispatch);
      });
    },
    loadTheme: () => {
      return new Promise<void>(() => {
        loadTheme(dispatch);
      });
    },
    dispatch,
  };
};

export default mapDispatchToProps;