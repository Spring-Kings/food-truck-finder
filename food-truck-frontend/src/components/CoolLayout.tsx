import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

import styles from './layout.module.css'

import Head from 'next/head'
import React, {ReactNode} from 'react'
import {Container} from '@material-ui/core'
import NotificationWatcherComponent from "./notifications/NotificationWatcher";

export const siteTitle = 'Stacked Trucks'

type Args = {
    children: ReactNode
}

function coolLayout(args: Args) {
  return (
    <>
      <NotificationWatcherComponent/>
      <Head>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="description" content="Oi mate description goes here"/>
      </Head>
      <div className={styles.outside}>
        <SiteHeader/>
        <Container maxWidth="md" className={styles.content}>
          <main>{args.children}</main>
        </Container>
        <SiteFooter/>
      </div>
    </>
  );
}

export default coolLayout;