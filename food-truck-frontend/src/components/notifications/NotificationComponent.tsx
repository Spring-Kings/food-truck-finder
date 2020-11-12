import React, {useState} from "react";
import {Grid, Card, CardContent, Button, Switch} from "@material-ui/core";
import {deleteNotification, Notification, setNotificationAsRead} from "../../api/Notification";

interface NotificationProps {
  notification: Notification;
  deletedCallback: (id: number) => void;
}

function NotificationComponent(props: NotificationProps) {
  const [read, setRead]: [boolean, any] = useState(props.notification.read);

  const modify = <>
    <Button variant="outlined"
            color="secondary"
            onClick={async () => {
              props.deletedCallback(props.notification.id);
              if (props.notification.type === "SUBSCRIPTION") {
                await deleteNotification(props.notification.id);
              }
            }}>
      Delete
    </Button>
    {"Read"}
    <Switch value={read}
            defaultChecked={read}
            onChange={async () => {
              setRead(!read);
              await setNotificationAsRead(props.notification.id, !read).catch(err => console.log(err));
            }}
            name="Read"
    />
  </>

  return (
    <Grid item xs>
      <Card>
        <CardContent>
          {`From: ${props.notification.truck.name} at ${props.notification.time}`}
          {props.notification.type === "SUBSCRIPTION" ? modify : " (Nearby Notification)"}
        </CardContent>
        <CardContent>
          {props.notification.message}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default NotificationComponent;