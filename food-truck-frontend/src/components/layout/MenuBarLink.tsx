import React from "react";
import {MenuItem} from "@material-ui/core";
import Router from "next/router";

interface ButtonLinkProps {
  href: string;
  text: string;
  action?: () => void;
}

function MenuBarLink(props: ButtonLinkProps) {
  return (
    <MenuItem onClick={() => {
      if (props.action) {
        props.action();
      }
      Router.replace(props.href)
    }}>
      {props.text}
    </MenuItem>
  );
}

export default MenuBarLink;