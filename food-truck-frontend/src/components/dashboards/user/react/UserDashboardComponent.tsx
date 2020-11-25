import React, {Component} from "react";

import Router from "next/router";

import Button from "@material-ui/core/Button";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CircularProgress, Container, Grid,
  GridList,
  GridListTile, List, ListItem,
  Typography,
} from "@material-ui/core";

import {UserData} from "../../../../redux/user/UserReducer";
import TruckListComponent from "../../TruckListComponent";
import {RouteLocation} from "../../../map/route-map/RouteLocation";
import {DEFAULT_ERR_RESP} from "../../../../api/DefaultResponses";
import {getNearbyTruckLocations} from "../../../../api/Truck";
import TruckLocationMapComponent from "../../../map/truck_location_map/TruckLocationMapComponent";
import TruckCardComponent from "../../../truck/TruckCardComponent";

// Dashboard props
interface UserDashboardProps {
  data: UserData | undefined;

  readonly [x: string]: any;
}

// Dashboard state
interface UserDashboardState {
  inError: string | null;
  nearbyTrucks: RouteLocation[];
  // TODO tighten typing
  viewTruck: any | undefined;
}

// Dashboard component
class UserDashboardComponent extends Component<
  UserDashboardProps,
  UserDashboardState
> {
  constructor(props: UserDashboardProps) {
    super(props);

    // Create state
    this.state = {
      inError: null,
      nearbyTrucks: [],
      viewTruck: undefined
    };

    // Bind methods
    this.viewTruck = this.viewTruck.bind(this);
    this.toOwnerDashboard = this.toOwnerDashboard.bind(this);
  }

  async componentDidMount() {
    // Load
    try {
      if (this.props.data != null) {
        let trucks: RouteLocation[] = await getNearbyTruckLocations(DEFAULT_ERR_RESP);
        this.setState({inError: null, nearbyTrucks: trucks});
      } else
        await this.props.loadUserFromBackend();
    } catch (err) {
      console.log(err);
      this.setState({ inError: err });
    }
  }

  render() {
    // Ensure the state is OK
    if (this.state.inError)
      return <Typography variant="h1">ERROR: not logged in</Typography>;
    else if (this.props.data === undefined) return <CircularProgress />;

    // If OK, return actual component
    return (
      <React.Fragment>
        {/** Props IDd using: https://material-ui.com/components/grid/ */}
        <GridList
          cols={5}
          style={{
            height: "100vh",
            width: "100%",
          }}
        >
          {/** Side list */}
          <GridListTile cols={2} style={{ height: '50vh' }}>
            <Grid container alignItems="flex-start">
              <Grid item>
                {this.props.data.ownedTrucks ? (
                  <Card>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.toOwnerDashboard}
                    >
                      Owner Dashboard
                    </Button>
                  </Card>
                ) : null}
              </Grid>
              <Grid item>
                <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
                  <List disablePadding>
                    {
                      this.props.data.subscribedTrucks.map(truck => (
                        <ListItem key={truck.id} style={{minWidth: '100%'}} disableGutters>
                          <TruckCardComponent id={truck.id} userOwnsTruck={true}/>
                        </ListItem>
                      ))
                    }
                  </List>
                </Container>
              </Grid>
            </Grid>
          </GridListTile>

          {/* Show nearby trucks on the map */}
          <GridListTile cols={3} style={{ height: '50vh' }}>
            <Grid container>
              <Grid item>
                <Typography variant="h4">Nearby Trucks</Typography>
              </Grid>
              <TruckLocationMapComponent locations={this.state.nearbyTrucks} height="50vh"/>
            </Grid>
          </GridListTile>
        </GridList>
      </React.Fragment>
    );
  }

  private viewTruck(id: number): void {
    Router.replace(`/truck/${id}`);
  }

  private toOwnerDashboard() {
    Router.replace("/dashboard/owner");
  }
}

export default UserDashboardComponent;
