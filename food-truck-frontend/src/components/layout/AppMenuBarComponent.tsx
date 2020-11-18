import React, {useEffect} from 'react'
import {AppBar, Avatar, Box, createStyles, Grid, Theme, Toolbar, Typography} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import LinkButton from "./LinkButton";
import {UserData} from "../../redux/user/UserReducer";
import NotificationWatcherComponent from "../notifications/NotificationWatcher";
import ThemeSwitchComponent from "./theme/ThemeSwitch";
import MenuDropdownComponent from "./MenuDropdownComponent";

export type AppMenuBarProps = {
  data: UserData,
  logoutUser: () => Promise<void>;
  loadUserFromBackend: () => Promise<void>;
};

const useAppBarStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
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

  const dashboardUrl = props.data.ownedTrucks !== undefined ? 'owner' : 'user';

  const menuBarItems = [
    <Avatar src="/logo.png" alt="logo" variant="rounded"/>,
    <Typography variant="h6">Stacked Trucks</Typography>,
    <LinkButton url="/" text="Home"/>,
    <LinkButton url="/search/truck" text="Search Trucks"/>,
    <LinkButton url="/interactive-map" text="Nearby Trucks"/>,
    <LinkButton url="/recommended-trucks" text="Recommended Trucks"/>,
  ];

  const menuDropdown = (
    <Box>
      <NotificationWatcherComponent/>
      <ThemeSwitchComponent/>
      {props.data.username !== "" && <MenuDropdownComponent logoutUser={props.logoutUser}/>}
    </Box>
  );

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Grid container direction="row" alignContent="space-between">
          {menuBarItems.map((item, index) => (
              <Grid item key={index}>
                {item}
              </Grid>
          ))}
          <Grid item>
            {props.data.username === "" ? (
                <LinkButton url="/login" text="Login"/>
            ) : (
                <LinkButton url={`/dashboard/${dashboardUrl}`} text="Dashboard"/>
            )}
          </Grid>
          {menuDropdown}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

