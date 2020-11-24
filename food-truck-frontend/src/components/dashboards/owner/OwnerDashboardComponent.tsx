import React, {useEffect, useState} from "react";
import Router from "next/router";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CircularProgress,
  Container,
  GridList,
  GridListTile,
  Typography,
} from "@material-ui/core";

import TruckListComponent from "../TruckListComponent";
import {UserData} from "../../../redux/user/UserReducer";
import {loadTodaysRoute} from "../../../api/RouteLocation";
import {DEFAULT_ERR_RESP} from "../../../api/DefaultResponses";
import {RouteLocation} from "../../map/route-map/RouteLocation";
import TruckLocationMapComponent from "../../map/truck_location_map/TruckLocationMapComponent";

interface OwnerDashboardProps {
  data: UserData | undefined;
  readonly [x: string]: any;
}

function OwnerDashboardComponent(props: OwnerDashboardProps) {
  const [inError, setInError]: [string | null, any] = useState(null);
  const [routePts, setRoutePts]: [RouteLocation[], any] = useState([]);

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
          HOME
        </Button>
      </Container>
    );

  // Return true UI
  return (
    <>
      {/** Props IDd using: https://material-ui.com/components/grid/ */}
      <GridList
        cols={5}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        {/** Side list */}
        <GridListTile cols={1} style={{ height: "100vh" }}>
          {/* Return to user dashboard */}
          <Card>
            <Button
              variant="contained"
              color="primary"
              onClick={toUserDashboard}
            >
              USER DASHBOARD
            </Button>
          </Card>

          {/* Subscribe list */}
          <Accordion>
            <AccordionSummary>My Trucks</AccordionSummary>
            <AccordionDetails>
              <TruckListComponent
                trucks={props.data.ownedTrucks}
                tail={
                  <Card>
                    <Button
                      variant="contained"
                      onClick={() => Router.replace("/create-truck")}
                    >
                      New...
                    </Button>
                  </Card>
                }
                handleTruckIcon={<Typography>View</Typography>}
                handleTruck={viewTruck}
              />
            </AccordionDetails>
          </Accordion>

          {/* Open manager page */}
          <Card>
            <Button
              variant="contained"
              onClick={() => Router.replace("/manage-trucks")}
            >
              Manage trucks
            </Button>
          </Card>
        </GridListTile>

        {/** Where the map would be */}
        <GridListTile cols={4} style={{ height: "100vh" }}>
          <TruckLocationMapComponent locations={routePts} />
        </GridListTile>
      </GridList>
    </>
  );
}

export default OwnerDashboardComponent;
