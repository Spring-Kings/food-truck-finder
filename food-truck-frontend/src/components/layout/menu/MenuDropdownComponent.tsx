import React, {useState} from "react";
import MenuBarLink from "../MenuBarLink";
import {IconButton, Menu, MenuItem, Switch} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {ThemeProps} from "../../theme/FoodTruckThemeProvider";

interface MenuDropdownComponentProps {
  logoutUser: () => Promise<void>;
  username: string;
}

function MenuDropdownComponent(props: MenuDropdownComponentProps & ThemeProps) {
  const [anchorEl, setAnchorEl]: [HTMLElement | null, any] = useState(null);
  const openMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  }
  const closeMenu = () => {
    setAnchorEl(null);
  }

  const [isDark, setIsDark]: [boolean, any] = useState(props.data.isDark);
  const switchTheme = () => {
    setIsDark(!isDark);
    props.switchTheme();
  }

  return (
    <>
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
        {props.username !== "" &&
        <MenuBarLink url="/" text="Logout" action={() => {
          closeMenu();
          props.logoutUser().catch(err => console.log(err));
        }}/>
        }
        <MenuItem>
          <Switch value={isDark} defaultChecked={isDark} onChange={switchTheme} name="Dark Mode"/>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MenuDropdownComponent;