import styles from './layout.module.css'
import React, {Component} from 'react'
import {Grid} from '@material-ui/core'
import {siteTitle} from "./CoolLayout";

type State = {}

type Props = {}

class SiteHeader extends Component<Props, State> {
    render() {
        return (
            <Grid container className={styles.header}>
                {siteTitle}
            </Grid>
        )
    }
}

export default SiteHeader;