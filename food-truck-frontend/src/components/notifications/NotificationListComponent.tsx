import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import NotificationComponent from "./NotificationComponent";
import { Notification, getNotifications } from "../../api/Notification";

interface NotificationListState {
  notifications: Notification[];
}

class NotificationListComponent extends Component<any, NotificationListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      notifications: []
    };
  }

  async componentDidMount() {
    let notifications = await getNotifications();
    this.setState({
      notifications: notifications
    });
  }

  render() {
    return (
      <Grid container direction="column" style={{ overflow: "auto" }}>
        {this.state.notifications.map((notification: Notification) => <NotificationComponent notification={notification}/>)}
      </Grid>
    );
  }
}

export default NotificationListComponent;

