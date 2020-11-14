import AppMenuBarComponent from './AppMenuBar'
import SiteFooter from '../SiteFooter'

import Head from 'next/head'
import React, {ReactNode} from 'react'
import {Box, Container, Grid, Paper} from '@material-ui/core'
import NotificationWatcherComponent from "../notifications/NotificationWatcher";
import withStyles from "@material-ui/core/styles/withStyles";

export const siteTitle = 'Stacked Trucks'

type Args = {
    children: ReactNode
}

const layoutStyles = {
  root: {

  }
}

function coolLayout(args: Args) {
  // <div className={styles.outside}>
  // <Container maxWidth="md" className={styles.content}>
  return (
    <>
      <NotificationWatcherComponent/>
      <Head>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="description" content="Oi mate description goes here"/>
      </Head>
      <Grid direction="row">
        <Grid item>
          <Box mb={4}>
            <AppMenuBarComponent/>
          </Box>
        </Grid>
        <Grid item>
          <Container maxWidth="xl">
            <Paper>
              <Box p={4}>
                <main>{args.children}</main>
              </Box>
            </Paper>
          </Container>
        </Grid>
        <Grid item>
          <Box p={2}>
            <SiteFooter/>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default withStyles(layoutStyles)(coolLayout);