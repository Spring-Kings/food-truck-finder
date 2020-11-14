import React from "react";
import {MenuItem} from "@material-ui/core";
import Router from "next/router";

interface ButtonLinkProps {
  url: string;
  text: string;
  action?: () => void;
}

function MenuBarLink(props: ButtonLinkProps) {
  return (
    <MenuItem onClick={() => {
      if (props.action) {
        props.action();
      }
      Router.replace(props.url);
    }}>
      {props.text}
    </MenuItem>
  );
}

export default MenuBarLink;