import React, {useEffect, useState} from 'react';
import {createMuiTheme, jssPreset, StylesProvider, ThemeOptions, ThemeProvider} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import CoolLayout, {Args} from "../layout/CoolLayout"
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import CssBaseline from "@material-ui/core/CssBaseline";
import {ThemeData} from "../../redux/theme/ThemeReducer";

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

const fontThemeOptions = {
  fontFamily: 'Roboto, Overpass, Noto Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 19,
  marginTop: 2,
  marginBottom: 2,
  body: {
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
};

const shape = {
  borderRadius: 4,
};

const dense = {
  margin: 'dense',
  padding: 'dense'
}

const lightBackground = {
  paper: grey[200],
  'default': blueGrey[200],
}

const darkBackground = {
  paper: '#181d1f',
  'default': '#1e272b',
}

const gridOptions = {
  direction: 'column',
  justify: 'center',
  alignItems: 'center',
  spacing: 2
};

const palette = {
  type: 'dark',
  background: darkBackground,
  primary: {
    light: blueGrey[800],
    main: blueGrey[900],
    dark: blueGrey[700],
    contrastText: grey[50],
  },
  secondary: {
    light: red[300],
    main: red[500],
    dark: red[400],
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
    MuiInputLabel: dense,
    MuiTextField: {
      variant: 'filled'
    },
    MuiGrid: gridOptions
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

export interface ThemeProps {
  data: ThemeData;
  loadTheme: () => Promise<void>;
  switchTheme: () => Promise<void>;
}

export const FoodTruckThemeProvider = (props: Args & ThemeProps) => {
  let [themeLoaded, setThemeLoaded]: [boolean, any] = useState(false);

  // @ts-ignore
  let theme = responsiveFontSizes(createMuiTheme({
    ...themeOptions,
    palette: {
      ...themeOptions.palette,
      background: props.data.isDark ? darkBackground : lightBackground,
      type: props.data.isDark ? 'dark' : 'light'
    }
  }));

  useEffect(() => {
    // Prevent infinitely loading the theme, causing the site to be unresponsive.
    if (!themeLoaded) {
      setThemeLoaded(true);
      props.loadTheme();
    }
  });

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CoolLayout>
          {props.children}
        </CoolLayout>
      </ThemeProvider>
    </StylesProvider>
  );
};