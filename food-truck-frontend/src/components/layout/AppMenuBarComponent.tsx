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
    menuButton: {
      marginRight: theme.spacing(2)
    },
  }),
);

export function AppMenuBarComponent(props: AppMenuBarProps) {
  const classes = useAppBarStyles();
  const [menuOpen, setMenuOpen]: [boolean, any] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
        <IconButton edge="start"
                    color="inherit"
                    className={classes.menuButton}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={toggleMenu}>
          <MenuIcon/>
          <Menu open={menuOpen} keepMounted={false}>
            <MenuBarLink url="/account" text="Account" action={toggleMenu}/>
            {props.data.username !== "" &&
              <MenuBarLink url="/" text="Logout" action={() => {
                toggleMenu();
                props.logoutUser().catch(err => console.log(err));
              }}/>
            }
          </Menu>
        </IconButton>
        <Grid container direction="row" alignItems="center" alignContent="space-between" spacing={2}>
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

