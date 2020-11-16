import React, {useState} from "react";
import {IconButton} from "@material-ui/core";
import {ThemeProps} from "../../theme/FoodTruckThemeProvider";
import {Brightness4, BrightnessHigh} from "@material-ui/icons";

function ThemeSwitchComponent(props: ThemeProps) {
  const switchTheme = () => {
    props.switchTheme();
  }
  return (
    <IconButton color="inherit"
                onClick={switchTheme}>
      {props.data.isDark ? <BrightnessHigh fontSize="small"/> : <Brightness4 fontSize="small"/>}
    </IconButton>
  );
}

export default ThemeSwitchComponent;