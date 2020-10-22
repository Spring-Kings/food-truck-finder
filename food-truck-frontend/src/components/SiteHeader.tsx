import styles from './layout.module.css'
import React, {Component} from 'react'
import {Breadcrumbs, Grid, Link as MuiLink} from '@material-ui/core'
import NextLink from 'next/link'

type State = {}

type Props = {}

class SiteHeader extends Component<Props, State> {
    render() {
        return (
            <Grid container className={styles.header} direction="column" alignItems="center" spacing={1}>
                <Grid item>
                    <NextLink href="/" passHref>
                        <img src="/logo.png" alt="logo" width="128px"/>
                    </NextLink>
                </Grid>
                <Grid item>
                    <Breadcrumbs>
                        <NextLink href="/" passHref>
                            <MuiLink>Home</MuiLink>
                        </NextLink>
                        <NextLink href="/register" passHref>
                            <MuiLink>Register</MuiLink>
                        </NextLink>
                        <NextLink href="/login" passHref>
                            <MuiLink>Login</MuiLink>
                        </NextLink>
                        <NextLink href="/" passHref>
                            <MuiLink>etc.</MuiLink>
                        </NextLink>
                    </Breadcrumbs>
                </Grid>

            </Grid>
        )
    }
}

export default SiteHeader;