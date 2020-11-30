import React, {Component} from "react";
import Router from "next/router";
import Button from "@material-ui/core/Button";
import {CircularProgress, Grid, Typography,} from "@material-ui/core";

import {RecommendedSimpleTruck, UserData} from "../../../../redux/user/UserReducer";
import {RouteLocation} from "../../../../domain/RouteLocation";
import {DEFAULT_ERR_RESP} from "../../../../api/DefaultResponses";
import {getNearbyTruckLocations, getNearbyTruckLocationsById} from "../../../../api/TruckApi";
import TruckListAndMapComponent from "../../../truck/TruckListAndMapComponent";
import api from "../../../../util/api";
import {LatLng} from "@google/maps";

// Dashboard props
interface UserDashboardProps {
  data: UserData | undefined;

  readonly [x: string]: any;
}

// Dashboard state
interface UserDashboardState {
  inError: string | null;
  nearbyTrucks: RouteLocation[];
  recommendedTrucks: RecommendedSimpleTruck[],
  location: LatLng,
  nearBy: boolean;
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
      recommendedTrucks: [],
      location: {lat: 0, lng: 0},
      nearBy: true,
      viewTruck: undefined
    };

    // Bind methods
    this.toOwnerDashboard = this.toOwnerDashboard.bind(this);
  }

  async componentDidMount() {

    // Load
    try {
      if (this.props.data != null) {
        let trucks = await getNearbyTruckLocations(DEFAULT_ERR_RESP);
        if (!trucks)
          throw "Couldn't get trucks"
        this.setState({inError: null, nearbyTrucks: trucks});
      } else
        await this.props.loadUserFromBackend();
    } catch (err) {
      console.log(err);
      this.setState({inError: err});
    }

    try {
      let resp: any = await api.request({
        url: "/truck/recommended",
        data: {
          acceptableRadius: 20,
          priceRating: 0,
          truckIds: localStorage.getItem("prevSearch") ? JSON.parse(`${localStorage.getItem("prevSearch")}`) : [],
          tags: [],
          location: this.state.location,
          active: false,
          numRequested: 10
        },
        method: "POST",
      });
      if (resp.data !== undefined) {
        this.setState({ recommendedTrucks: resp.data })
      }

    } catch (err) {
      DEFAULT_ERR_RESP(err);
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
                                  recommendedTrucks={this.state.recommendedTrucks}
                                  mapLabel={'Nearby Trucks'}/>
      </>

    );
  }

  private toOwnerDashboard() {
    Router.push("/dashboard/owner");
  }
}

export default UserDashboardComponent;