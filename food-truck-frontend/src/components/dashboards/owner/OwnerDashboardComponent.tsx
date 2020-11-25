import React, {useEffect, useState} from "react";
import Router from "next/router";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Box,
  Button,
  Card, CardActionArea, CardActions, CardContent, CardHeader,
  CircularProgress,
  Container, Dialog, DialogContent, Grid,
  GridList,
  GridListTile, List, ListItem,
  Typography,
} from "@material-ui/core";

import TruckListComponent from "../TruckListComponent";
import {UserData} from "../../../redux/user/UserReducer";
import {loadTodaysRoute} from "../../../api/RouteLocation";
import {DEFAULT_ERR_RESP} from "../../../api/DefaultResponses";
import {RouteLocation} from "../../map/route-map/RouteLocation";
import TruckLocationMapComponent from "../../map/truck_location_map/TruckLocationMapComponent";
import {useFlexGrowStyles} from "../../theme/FoodTruckThemeProvider";
import TruckCardComponent from "../../truck/TruckCardComponent";
import {StyledDialogTitle} from "../../util/StyledDialogTitle";
import CreateTruckForm from "../../CreateTruckForm";

interface OwnerDashboardProps {
  data: UserData | undefined;
  readonly [x: string]: any;
}

function OwnerDashboardComponent(props: OwnerDashboardProps) {
  const classes = useFlexGrowStyles();
  const [inError, setInError]: [string | null, any] = useState(null);
  const [routePts, setRoutePts]: [RouteLocation[], any] = useState([]);
  const [creatingTruck, setCreatingTruck]: [boolean, any] = useState(false);

  const viewTruck = (id: number): void => {
    Router.replace(`/truck/${id}`);
  };

  const toUserDashboard = (): void => {
    Router.replace("/dashboard/user");
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
        <Button variant="contained" onClick={() => Router.replace("/")}>
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
      <GridList cols={5}
                style={{
                  height: "100vh",
                  width: "100%",
                }}>
        <GridListTile cols={2} style={{ height: '50vh' }}>
          <Box pt={1} px={3}>
            <Typography variant="h6">Owned Trucks</Typography>
          </Box>
          <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
            <List disablePadding>
              {
                props.data?.ownedTrucks?.map(truck => (
                  <ListItem key={truck.id} style={{ minWidth: '100%' }} disableGutters>
                    <TruckCardComponent id={truck.id} userOwnsTruck={true}/>
                  </ListItem>
                ))
              }
            </List>
          </Container>
        </GridListTile>
        <GridListTile cols={3} style={{ height: '50vh' }}>
          <Box py={0.5} px={3}>
            <Typography variant="h6">Active Locations</Typography>
          </Box>
          <TruckLocationMapComponent locations={routePts} height="50vh"/>
        </GridListTile>
      </GridList>
    </>
  );
}

export default OwnerDashboardComponent;
