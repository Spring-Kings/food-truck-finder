import {IconButton, Menu} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import LinkButton from "./LinkButton";
import React, {useState} from "react";

interface MenuProps {
  logoutUser: () => Promise<void>;
}

function MenuDropdownComponent(props: MenuProps) {
  const [anchorEl, setAnchorEl]: [HTMLElement | null, any] = useState(null);
  const openMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  }
  const closeMenu = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton color="inherit"
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
        <LinkButton url="/account" text="Account" action={() => closeMenu()}/>
        <LinkButton url="/" text="Logout" action={() => {
          closeMenu();
          props.logoutUser().catch(err => console.log(err));
        }}/>
      </Menu>
    </>
  );
}

export default MenuDropdownComponent;