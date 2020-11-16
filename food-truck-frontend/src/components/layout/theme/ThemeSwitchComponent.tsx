import React, {useState} from "react";
import {IconButton} from "@material-ui/core";
import {ThemeProps} from "../../theme/FoodTruckThemeProvider";
import {Brightness4, BrightnessHigh} from "@material-ui/icons";

function ThemeSwitchComponent(props: ThemeProps) {
  const [isDark, setIsDark]: [boolean, any] = useState(props.data.isDark);
  const switchTheme = () => {
    setIsDark(!isDark);
    props.switchTheme();
  }
  return (
    <IconButton color="inherit"
                onClick={switchTheme}>
      {isDark ? <BrightnessHigh fontSize="small"/> : <Brightness4 fontSize="small"/>}
    </IconButton>
  );
}

export default ThemeSwitchComponent;