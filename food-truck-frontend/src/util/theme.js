import React, {useState} from 'react';
import {createMuiTheme, ThemeProvider, StylesProvider, jssPreset, withStyles} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import CoolLayout from "../components/layout/CoolLayout"
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
import red from "@material-ui/core/colors/red";
// import darkBaseTheme from '@material-ui/styles/baseThemes/darkBaseTheme';
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Switch } from '@material-ui/core';

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

const fontThemeOptions = {
  fontFamily: 'Noto Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 19,
  marginTop: 2,
  marginBottom: 2,
  body2: {
    fontSize: 14
  }
}

const spacing = 16;

const muiButton = {
  root: {
    textTransform: 'none',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    width: '200px',
    height: '50px',
  },
  color: 'primary',
  variant: 'contained',
  outlinedPrimary: {
    border: '2px solid'
  },
  outlinedSecondary: {
    border: '2px solid'
  },
};

const shape = {
  borderRadius: 4,
};

const dense = {
  margin: 'dense',
  padding: 'dense'
}

const palette = {
  type: 'dark',
  // background: {
  //   paper: grey[800],
  //   'default': grey[900], // blueGrey[900]
  // },
  primary: {
    light: lightBlue[400],
    main: lightBlue[500],
    dark: lightBlue[600],
    contrastText: grey[50],
  },
  secondary: {
    light: blueGrey[900],
    main: blueGrey[800],
    dark: blueGrey[700],
    contrastText: grey[50],
  },
};

let themeOptions = {
  typography: fontThemeOptions,
  spacing: spacing,
  shape: shape,
  palette: palette,
  props: {
    MuiButton: muiButton,
    MuiOutlinedInput: dense,
    MuiFilledInput: dense,
    MuiFormHelperText: dense,
    MuiIconButton: dense,
    MuiInputBase: dense,
    MuiInputLabel: dense
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
      },
    },
  }
};

export const FoodTruckThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(true);
  const paletteType = isDark ? 'dark' : 'light';
  let options = themeOptions;
  options.palette.type = paletteType;
  let theme = responsiveFontSizes(createMuiTheme(options));
  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CoolLayout>
          {children}
        </CoolLayout>
      </ThemeProvider>
    </StylesProvider>
  );
};