import React, {useEffect, useState} from 'react'
import {
  AppBar, Avatar,
  createStyles,
  Grid,
  IconButton, Menu,
  Theme,
  Toolbar,
  Typography
} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import MenuBarLink from "./MenuBarLink";
import {UserData} from "../../redux/user/UserReducer";
import NotificationWatcherComponent from "../notifications/NotificationWatcher";

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
  const [anchorEl, setAnchorEl]: [HTMLElement | null, any] = useState(null);
  const openMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  }
  const closeMenu = () => {
    setAnchorEl(null);
  }

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

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Grid container direction="row" alignItems="center" justify="center" alignContent="space-between" spacing={2}>
          <Grid item>
            <IconButton edge="end"
                        color="inherit"
                        aria-controls="bar-menu"
                        aria-haspopup="true"
                        onClick={openMenu}>
              <MenuIcon/>
            </IconButton>
            <Menu id="bar-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}>
              <MenuBarLink url="/account" text="Account" action={closeMenu}/>
              {props.data.username !== "" &&
              <MenuBarLink url="/" text="Logout" action={() => {
                closeMenu();
                props.logoutUser().catch(err => console.log(err));
              }}/>
              }
            </Menu>
          </Grid>
          <Grid item>
            <NotificationWatcherComponent/>
          </Grid>
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
            <MenuBarLink url="/dashboard/user" text="User Dashboard"/>
          </Grid>
          <Grid item>
            <MenuBarLink url="/dashboard/owner" text="Owner Dashboard"/>
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
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

