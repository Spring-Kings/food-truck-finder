import React, {useEffect, useState} from 'react'
import {
  AppBar, Avatar,
  createStyles,
  Grid,
  Theme,
  Toolbar,
  Typography
} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import MenuBarLink from "./MenuBarLink";
import {UserData} from "../../redux/user/UserReducer";
import NotificationWatcherComponent from "../notifications/NotificationWatcher";
import MenuDropdownComponent from "./menu/MenuDropdown";

export type AppMenuBarProps = {
  data: UserData,
  logoutUser: () => Promise<void>;
  loadUserFromBackend: () => Promise<void>;
};

const useAppBarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    // menuButton: {
    //   marginRight: theme.spacing(2)
    // },
  }),
);

export function AppMenuBarComponent(props: AppMenuBarProps) {
  const classes = useAppBarStyles();

  const loadUser = () => {
    if (localStorage.getItem("authToken") !== undefined && props.data.username === "") {
      props.loadUserFromBackend().then(
        (_response: any) => console.log('Loaded user'),
        (err: any) => console.log(err)
      );
    }
  }
  useEffect(() => {
    loadUser();
  });

  let dashboardUrl = props.data.ownedTrucks !== undefined ? 'owner' : 'user';

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Grid container direction="row" alignItems="center" justify="center" alignContent="space-between" spacing={2}>
          <Grid item>
            <Avatar src="/logo.png" alt="logo" variant="rounded"/>
          </Grid>
          <Grid item>
            <Typography variant="h6">Stacked Trucks</Typography>
          </Grid>
          <Grid item>
            <MenuBarLink url="/" text="Home"/>
          </Grid>
          <Grid item>
            <MenuBarLink url={`/dashboard/${dashboardUrl}`} text="Dashboard"/>
          </Grid>
          <Grid item>
            <MenuBarLink url="/search/truck" text="Search Trucks"/>
          </Grid>
          <Grid item>
            <MenuBarLink url="/interactive-map" text="Nearby Trucks"/>
          </Grid>
          <Grid item>
            <MenuBarLink url="/recommended-trucks" text="Recommended Trucks"/>
          </Grid>
          {props.data.username === "" &&
            <Grid item>
              <MenuBarLink url="/login" text="Login"/>
            </Grid>
          }
          <Grid item>
            <NotificationWatcherComponent/>
          </Grid>
          <Grid item>
            <MenuDropdownComponent logoutUser={props.logoutUser} username={props.data.username}/>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

