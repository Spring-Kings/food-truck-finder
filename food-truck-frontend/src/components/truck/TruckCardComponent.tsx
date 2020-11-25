import React, {useEffect, useState} from 'react';
import {TruckState, userCanEditTruck} from "../TruckView";
import {getTruckById} from "../../api/Truck";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  createStyles, Dialog, DialogContent,
  Grid,
  Theme
} from "@material-ui/core";
import Router from "next/router";
import {MoneyRating, StarRating} from "./rate_and_review/ratings";
import {makeStyles} from "@material-ui/core/styles";
import SendNotificationComponent from "../notifications/SendNotificationComponent";
import {StyledDialogTitle} from "../util/StyledDialogTitle";

export const useTruckDescriptionStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      minWidth: '100%'
    },
  }),
);

interface TruckCardProps {
  id: number;
  userOwnsTruck: boolean;
  onRedirect?: () => void;
}

function TruckCardComponent(props: TruckCardProps) {
  const classes = useTruckDescriptionStyles();
  const [truck, setTruck]: [TruckState, any] = useState({
    id: 0,
    userId: 0,
    name: "",
    description: "",
    priceRating: null,
    tags: [],
    starRating: null,
    menuContentType: null
  });
  const [sendingNotification, setSendingNotification]: [boolean, any] = useState(false);

  const redirect = (url: string): void => {
    if (props.onRedirect) props.onRedirect();
    Router.replace(url).then(() => Router.reload());
  }
  const viewTruck = (id: number): void => redirect(`/truck/${id}`);
  const editTruck = (id: number): void => redirect(`/truck/edit/${id}`);
  const manageRoutes = (id: number): void => redirect(`/manage-routes/${id}`);

  useEffect(() => {
    getTruckById(props.id, (err) => console.log(`Could not load truck card: ${err}`))
      .then(truck => {
        if (truck) {
          setTruck(truck);
        } else {
          console.log('TruckCardComponent: TruckState undefined or null');
        }
      });
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader title={truck.name}/>
      <CardActionArea onClick={() => viewTruck(truck.id)}>
        <CardContent>
          <Grid container alignItems="flex-start">
            <Grid item>{truck.description}</Grid>
            <Grid item container direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item>
                <MoneyRating readOnly precision={0.1} disabled value={truck.priceRating}/>
              </Grid>
              <Grid item>
                {truck.starRating && <StarRating readOnly precision={0.1} disabled value={truck.starRating}/>}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={() => viewTruck(truck.id)}>
          View Truck
        </Button>
        {props.userOwnsTruck && <>
          <Button onClick={() => editTruck(truck.id)}>
            Edit Truck
          </Button>
          <Button onClick={() => manageRoutes(truck.id)}>
            Manage Routes
          </Button>
          <Button onClick={() => setSendingNotification(true)}>
            Send Notification
          </Button>
          <Dialog open={sendingNotification}
                  fullWidth
                  maxWidth="md">
            <StyledDialogTitle onClose={() => setSendingNotification(false)}>
              Send Notification
            </StyledDialogTitle>
            <DialogContent>
              <SendNotificationComponent truckId={truck.id}/>
            </DialogContent>
          </Dialog>
        </>}
      </CardActions>
    </Card>
  );
}

export default TruckCardComponent;