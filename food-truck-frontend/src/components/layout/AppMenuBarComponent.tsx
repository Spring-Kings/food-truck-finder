import React, {useEffect} from 'react'
import {AppBar, Avatar, Box, Grid, Toolbar, Typography} from '@material-ui/core'
import LinkButton from "./LinkButton";
import {UserData} from "../../redux/user/UserReducer";
import NotificationWatcherComponent from "../notifications/NotificationWatcher";
import ThemeSwitchComponent from "./theme/ThemeSwitch";
import MenuDropdownComponent from "./MenuDropdownComponent";
import QuickSearchComponent from "../search/QuickSearchComponent";
import {useFlexGrowStyles} from "../theme/FoodTruckThemeProvider";

export type AppMenuBarProps = {
  data: UserData,
  logoutUser: () => Promise<void>;
  loadUserFromBackend: () => Promise<void>;
};

export function AppMenuBarComponent(props: AppMenuBarProps) {
  const classes = useFlexGrowStyles();

  const loadUser = () => {
    if (localStorage.getItem("authToken") != null && props.data.username === "") {
      props.loadUserFromBackend().then(
        (_response: any) => console.log('Loaded user'),
        (err: any) => console.log(err)
      );
    }
  }
  useEffect(() => {
    loadUser();
  });

  const dashboardUrl = props.data.owner ? 'owner' : 'user';

  const menuBarItems = [
    { key: "avatar", val: <Avatar src="/logo.png" alt="logo" variant="rounded"/> },
    { key: "title", val: <Typography variant="h6">Stacked Trucks</Typography> },
    { key: "home", val: <LinkButton url="/" text="Home"/> },
    { key: "search", val: <LinkButton url="/search/truck" text="Search Trucks"/> },
    { key: "nearby", val: <LinkButton url="/interactive-map" text="Nearby Trucks"/> },
    { key: "recommended", val: <LinkButton url="/recommended-trucks" text="Recommended Trucks"/> },
  ];

  const menuDropdown = (
    <Box>
      <QuickSearchComponent/>
      <NotificationWatcherComponent/>
      <ThemeSwitchComponent/>
      {props.data.username !== "" && <MenuDropdownComponent logoutUser={props.logoutUser}/>}
    </Box>
  );

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Grid container direction="row" alignContent="space-between">
          {menuBarItems.map((item) => (
              <Grid key={item.key} item>
                {item.val}
              </Grid>
          ))}
          <Grid key="login/dashboard" item>
            {props.data.username === "" ? (
                <LinkButton url="/login" text="Login"/>
            ) : (
              <LinkButton url={`/dashboard/${dashboardUrl}`} text={`${props.data.username}'s Dashboard`}/>
            )}
          </Grid>
          {menuDropdown}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

