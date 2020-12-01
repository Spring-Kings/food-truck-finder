import React, {useEffect, useState} from 'react';
import {getTruckById} from "../../api/TruckApi";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Dialog,
  DialogContent,
  Grid,
  Theme
} from "@material-ui/core";
import { useRouter } from "next/router";
import {MoneyRating, StarRating} from "./rate_and_review/ratings";
import {makeStyles} from "@material-ui/core/styles";
import SendNotificationComponent from "../notifications/SendNotificationComponent";
import {StyledDialogTitle} from "../util/StyledDialogTitle";
import Truck, {emptyTruck} from "../../domain/Truck";

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
  const router = useRouter();
  const classes = useTruckDescriptionStyles();
  const [truck, setTruck]: [Truck, any] = useState(emptyTruck());
  const [sendingNotification, setSendingNotification]: [boolean, any] = useState(false);

  const redirect = (url: string, id: number): void => {
    if (props.onRedirect) props.onRedirect();
    router.push({
      pathname: url,
      query: { truckId: id }
    }).then(() => {
      if (router.pathname === url)
        router.reload();
    });
  }
  const viewTruck = (id: number): void => redirect(`/truck/[truckId]`, id);
  const editTruck = (id: number): void => redirect(`/truck/edit/[truckId]`, id);
  const manageRoutes = (id: number): void => redirect(`/manage-routes/[truckId]`, id);

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
      <CardActionArea onClick={() => viewTruck(truck.id)}>
        <CardHeader title={truck.name}/>
      </CardActionArea>
      <CardContent>
          <Grid container alignItems="flex-start">
            <Grid item>{truck.description}</Grid>
            <Grid item container direction="row" justify="flex-start" alignItems="flex-start">
              {truck.priceRating && 
              <Grid item>
                <MoneyRating name={`${truck.id}-priceRating`} readOnly precision={0.1} value={truck.priceRating}/>
              </Grid>
              }
              {truck.starRating && 
              <Grid item>
                <StarRating name={`${truck.id}-starRating`} readOnly precision={0.1} value={truck.starRating}/>
              </Grid>
              }
            </Grid>
          </Grid>
        </CardContent>
      <CardActions>
        <Button onClick={() => viewTruck(truck.id)}>
          View Truck
        </Button>
        {props.userOwnsTruck && (
        <>
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
        </>
        )}
      </CardActions>
    </Card>
  );
}

export default TruckCardComponent;