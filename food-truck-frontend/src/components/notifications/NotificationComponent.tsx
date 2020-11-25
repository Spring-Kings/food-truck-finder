import React, {useState} from "react";
import {Grid, Card, CardContent, Button, Switch, Typography, CardActions, Box, CardHeader} from "@material-ui/core";
import {deleteNotification, Notification, setNotificationAsRead} from "../../api/Notification";
import Router from "next/router";

interface NotificationProps {
  notification: Notification;
  deletedCallback: (id: number) => void;
}

function NotificationComponent(props: NotificationProps) {
  const [read, setRead]: [boolean, any] = useState(props.notification.read);

  const modify = <>
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
  </>;

  // Not parsing this causes a RangeError exception in DateTimeFormat.format() because
  // it claims the date value is not finite
  //@ts-ignore
  const parsedDate = Date.parse(props.notification.time);

  const timeOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  const dateTime = new Intl.DateTimeFormat('en-US', timeOptions).format(parsedDate);

  return (
    <Grid item xs>
      <Card>
        <CardHeader title={`From: ${props.notification.truck.name}`}/>
        <CardContent>
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid item>
              <Typography>
              {`Sent: ${dateTime}`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                {props.notification.message}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="flex-end" alignItems="flex-end">
            <Grid item>
              <Button onClick={() => Router.replace(`/truck/${props.notification.truck.id}`)}>View Truck</Button>
            </Grid>
            {props.notification.type === "SUBSCRIPTION" ? modify : 
              <Grid item>
                  <Typography variant="h6">Promotion</Typography>
              </Grid>
            }
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default NotificationComponent;