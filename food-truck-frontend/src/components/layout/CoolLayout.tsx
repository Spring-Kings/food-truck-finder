import AppMenuBarComponent from './AppMenuBar'
import SiteFooter from '../SiteFooter'

import Head from 'next/head'
import React, {ReactNode} from 'react'
import {Box, Container, createStyles, Grid, Paper, Theme} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";

export const siteTitle = 'Stacked Trucks'

export type Args = {
  children: ReactNode
}

const useLayoutStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      minHeight: '100vh',
      flexGrow: 1,
    },
  }),
);

function coolLayout(args: Args) {
  const classes = useLayoutStyles();
  return (
    <>
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
            <Paper className={classes.paper}>
              <Box p={4}>
                <Container>
                  <main>{args.children}</main>
                </Container>
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

export default coolLayout;