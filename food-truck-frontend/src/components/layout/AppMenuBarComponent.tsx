import React, {useState} from 'react'
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
  logoutUser: () => void;
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
  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <IconButton edge="start"
                    color="inherit"
                    className={classes.menuButton}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon/>
          <Menu open={menuOpen} keepMounted>
            <MenuBarLink href="/account" text="Account"/>
            {props.data.username !== "" &&
              <MenuBarLink href="/logout" text="Logout" action={() => props.logoutUser()}/>
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
            <MenuBarLink href="/" text="Home"/>
          </Grid>
          <Grid item>
            <MenuBarLink href="/dashboard/user" text="User Dashboard"/>
          </Grid>
          <Grid item>
            <MenuBarLink href="/dashboard/user" text="Owner Dashboard"/>
          </Grid>
          <Grid item>
            <MenuBarLink href="/truck/search" text="Search Trucks"/>
          </Grid>
          <Grid item>
            <MenuBarLink href="/interactive-map" text="Nearby Trucks"/>
          </Grid>
          <Grid item>
            <MenuBarLink href="/recommended-trucks" text="Recommended Trucks"/>
          </Grid>
          {props.data.username === "" &&
            <Grid item>
              <MenuBarLink href="/login" text="Login"/>
            </Grid>
          }
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

