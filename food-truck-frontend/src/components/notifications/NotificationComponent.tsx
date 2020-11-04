import React from "react";
import {Grid, Card, CardContent, Button, Switch} from "@material-ui/core";
import {deleteNotification, Notification, setNotificationAsRead} from "../../api/Notification";

interface NotificationProps {
  notification: Notification;
}

function NotificationComponent(props: NotificationProps) {
  return (
    <Grid item xs>
      <Card>
        <CardContent>
          {`From: ${props.notification.truck.name} at ${props.notification.time}`}
          <Button variant="outlined"
                  color="secondary"
                  onClick={() => deleteNotification(props.notification.id)}>
            Delete
          </Button>
          {"Read"}
          <Switch value={props.notification.isRead}
                  onChange={() => setNotificationAsRead(props.notification.id, !props.notification.isRead)}
                  name="Read"
          />
        </CardContent>
        <CardContent>
          {props.notification.message}
        </CardContent>
      </Card>
    </Grid>
  );
}

const toggleRead = () => {

}

export default NotificationComponent;