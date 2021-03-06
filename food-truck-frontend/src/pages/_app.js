// Apply global-styles to ALL pages (so don't put stupid stuff in it)
import '../../public/global-styles.css'

import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {buildStore} from '../util/redux';

import Head from 'next/head';
import FoodTruckThemeProvider from '../components/theme/Theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

let initialState = {};
let store = buildStore(initialState);

// Create app
const FoodTruckApp = ({Component, pageProps}) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
      <Provider store={store}>
          <Head>
              <title>Stacked Trucks</title>
              <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
          </Head>


          <MuiThemeProvider>
              <FoodTruckThemeProvider>
                  <Component {...pageProps} />
              </FoodTruckThemeProvider>
          </MuiThemeProvider>

      </Provider>
  )
};

export default FoodTruckApp;