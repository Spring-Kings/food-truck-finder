import React, {useState} from "react";
import {Grid, Card, CardContent, Button, Switch} from "@material-ui/core";
import {deleteNotification, Notification, setNotificationAsRead} from "../../api/Notification";

interface NotificationProps {
  notification: Notification;
}

function NotificationComponent(props: NotificationProps) {
  const [read, setRead]: [boolean, any] = useState(props.notification.read);
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
          <Switch value={read}
                  onChange={async () => {
                    setRead(!read);
                    await setNotificationAsRead(props.notification.id, read);
                  }}
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

export default NotificationComponent;