import React, {Component} from "react";

import Router from "next/router";

import Button from "@material-ui/core/Button";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Box,
  Card,
  CircularProgress, Container, Dialog, DialogContent, Grid,
  GridList,
  GridListTile, List, ListItem, ListSubheader,
  Typography,
} from "@material-ui/core";

import {UserData} from "../../../../redux/user/UserReducer";
import TruckListComponent from "../../TruckListComponent";
import {RouteLocation} from "../../../map/route-map/RouteLocation";
import {DEFAULT_ERR_RESP} from "../../../../api/DefaultResponses";
import {getNearbyTruckLocations} from "../../../../api/Truck";
import TruckLocationMapComponent from "../../../map/truck_location_map/TruckLocationMapComponent";
import TruckCardComponent from "../../../truck/TruckCardComponent";
import TruckListAndMapComponent from "../../../truck/TruckListAndMapComponent";
import {StyledDialogTitle} from "../../../util/StyledDialogTitle";
import CreateTruckForm from "../../../CreateTruckForm";

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
      <>
        {this.props.data.ownedTrucks ? (
          <Grid container direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.toOwnerDashboard}
              >
                Owner Dashboard
              </Button>
            </Grid>
          </Grid>
        ) : null}
        <TruckListAndMapComponent routePts={this.state.nearbyTrucks}
                                  trucks={this.props.data.subscribedTrucks}
                                  listLabel={'Subscribed Trucks'}
                                  mapLabel={'Nearby Trucks'}/>
      </>
    );
  }

  private toOwnerDashboard() {
    Router.replace("/dashboard/owner");
  }
}

export default UserDashboardComponent;
