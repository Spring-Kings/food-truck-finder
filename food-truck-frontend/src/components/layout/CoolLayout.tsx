import AppMenuBarComponent from './AppMenuBar'
import SiteFooter from '../SiteFooter'

import Head from 'next/head'
import React, {ReactNode} from 'react'
import {Container} from '@material-ui/core'
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
      <>
        <AppMenuBarComponent/>
        <Container maxWidth="xl">
          <main>{args.children}</main>
        </Container>
        <SiteFooter/>
      </>
    </>
  );
}

export default withStyles(layoutStyles)(coolLayout);