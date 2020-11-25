import React, {useState} from "react";
import {Grid, Card, CardContent, Button, Switch, Typography, CardActions} from "@material-ui/core";
import {deleteNotification, Notification, setNotificationAsRead} from "../../api/Notification";

interface NotificationProps {
  notification: Notification;
  deletedCallback: (id: number) => void;
}

function NotificationComponent(props: NotificationProps) {
  const [read, setRead]: [boolean, any] = useState(props.notification.read);

  const modify = <Grid container direction="row">
    <Grid item>
      <Button color="secondary"
              onClick={async () => {
                props.deletedCallback(props.notification.id);
                if (props.notification.type === "SUBSCRIPTION") {
                  await deleteNotification(props.notification.id);
                }
              }}>
        Delete
      </Button>
    </Grid>
    <Grid item>
      {"Read"}
      <Switch value={read}
              defaultChecked={props.notification.read}
              onChange={async () => {
                setRead(!read);
                await setNotificationAsRead(props.notification.id, !read).catch(err => console.log(err));
              }}
              name="Read"
      />
    </Grid>
  </Grid>;

  return (
    <Grid item xs>
      <Card>
        <CardContent>
          <Typography variant="h6">
            {`From: ${props.notification.truck.name} at ${props.notification.time.toLocaleString('en-US')}`}
          </Typography>
          <Typography>
            {props.notification.message}
          </Typography>
        </CardContent>
        <CardActions>

          {props.notification.type === "SUBSCRIPTION" ? modify : " (Nearby Notification)"}
        </CardActions>
      </Card>
    </Grid>
  );
}

export default NotificationComponent;