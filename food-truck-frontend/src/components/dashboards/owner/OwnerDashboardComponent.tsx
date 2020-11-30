import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";

import {
  Button,
  CircularProgress,
  Container, Dialog, DialogContent, Grid,
  Typography,
} from "@material-ui/core";

import {UserData} from "../../../redux/user/UserReducer";
import {loadTodaysRoute} from "../../../api/RouteLocation";
import {DEFAULT_ERR_RESP} from "../../../api/DefaultResponses";
import {RouteLocation} from "../../map/route-map/RouteLocation";
import {useFlexGrowStyles} from "../../theme/FoodTruckThemeProvider";
import {StyledDialogTitle} from "../../util/StyledDialogTitle";
import CreateTruckForm from "../../CreateTruckForm";
import TruckListAndMapComponent from "../../truck/TruckListAndMapComponent";

interface OwnerDashboardProps {
  data: UserData | undefined;
  readonly [x: string]: any;
}

function OwnerDashboardComponent(props: OwnerDashboardProps) {
  const router = useRouter();
  const classes = useFlexGrowStyles();
  const [inError, setInError]: [string | null, any] = useState(null);
  const [routePts, setRoutePts]: [RouteLocation[], any] = useState([]);
  const [creatingTruck, setCreatingTruck]: [boolean, any] = useState(false);

  const toUserDashboard = (): void => {
    router.push("/dashboard/user");
  }

  useEffect(() => {
    props.loadUserFromBackend().then(
      (_response: any) => setInError(null),
      (err: any) => setInError(err)
    );
  }, []);

  useEffect(() => {
    props.data?.ownedTrucks?.forEach(async truck => {
      try {
        const pts = await loadTodaysRoute(truck.id, DEFAULT_ERR_RESP);
        setRoutePts(routePts.concat(pts));
      } catch (err) {
        setInError(err);
      }
    });
  }, [props.data?.ownedTrucks]);

  // Be safe: don't show to people who don't deserve it. Of course you can hack and bypass it,
  // but it looks better to our "customers"
  // Uh, who's paying for this thing again?
  if (props.data === undefined)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  else if (inError)
    return (
      <Container>
        <Typography variant="h2">Error</Typography>
        <Typography>{inError}</Typography>
      </Container>
    );
  else if (!props.data.ownedTrucks)
    return (
      <Container>
        <Typography variant="h2">Oops!</Typography>
        <Typography>
          It seems you got to this corner of our site by mistake. Please
          return to the home menu
        </Typography>
        <Button variant="contained" onClick={() => router.push("/")}>
          Home
        </Button>
      </Container>
    );

  return (
    <>
      <Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.root}>
        <Grid item>
          <Button
            variant="contained"
            onClick={toUserDashboard}
          >
            User Dashboard
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={() => setCreatingTruck(true)}>
            Create Truck
          </Button>
          <Dialog open={creatingTruck}
                  fullWidth
                  maxWidth="md">
            <StyledDialogTitle onClose={() => setCreatingTruck(false)}>
              Create Truck
            </StyledDialogTitle>
            <DialogContent>
              <CreateTruckForm/>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
      <TruckListAndMapComponent routePts={routePts}
                                trucks={props.data?.ownedTrucks}
                                listLabel={'Owned Trucks'}
                                mapLabel={'Active Locations'}
                                owner={true}/>
    </>
  );
}

export default OwnerDashboardComponent;
