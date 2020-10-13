import styles from './layout.module.css'
import React from 'react'
import {Grid} from '@material-ui/core'

const siteFooter = () => {
    return (
        <Grid className={styles.footer}>&copy; Spring Kings 2020</Grid>
    )
}

export default siteFooter;