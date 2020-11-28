import React from "react";
import {MenuItem} from "@material-ui/core";
import Router from "next/router";

interface ButtonLinkProps {
  url: string;
  text: string;
  action?: () => void;
}

class LinkButton extends React.Component<ButtonLinkProps, {}> {
  constructor(props: ButtonLinkProps) {
    super(props);
  }

  render() {
    return (
      <MenuItem onClick={this.onClick}>
        {this.props.text}
      </MenuItem>
    );
  }

  onClick = () => {
    if (this.props.action) {
      this.props.action();
    }
    Router.replace(this.props.url);
  }

}

export default LinkButton;