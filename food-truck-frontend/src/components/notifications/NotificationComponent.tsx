import React from "react";

import { Grid, Card, CardContent } from "@material-ui/core";
import { Notification } from "../../api/Notification";

interface NotificationProps {
  notification: Notification;
}

function NotificationComponent(props: NotificationProps) {
  return (
    <Grid item xs>
      <Card>
        <CardContent>
          {props.notification.truck.name}
          {props.notification.message}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default NotificationComponent;