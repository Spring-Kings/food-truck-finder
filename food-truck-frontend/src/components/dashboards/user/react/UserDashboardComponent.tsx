import React, { Component } from "react";

import Router from "next/router";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  CircularProgress,
  GridList,
  GridListTile,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";

import TruckRouteMapComponent from "../../../map";
import { SimpleTruck, UserData } from "../../../../redux/user/UserReducer";
import TruckListComponent from "../../TruckListComponent";

// Dashboard props
interface UserDashboardProps {
  data: UserData | undefined;
  readonly [x: string]: any;
}

// Dashboard state
interface UserDashboardState {
  addTruck: boolean;
  inError: string | null;
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
      addTruck: false,
      inError: null,
    };

    // Bind methods
    this.viewTruck = this.viewTruck.bind(this);
    this.toOwnerDashboard = this.toOwnerDashboard.bind(this);
  }

  componentDidMount() {
    // Load
    this.props.loadUserFromBackend().then(
      (_response: any) => this.setState({ inError: null }),
      (err: any) => this.setState({ inError: err })
    );
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
          <GridListTile cols={1} style={{ height: "100vh" }}>
            {/* Image */}
            <Card>
              <img
                src="../../../../resources/stacked_trucks_wheany_CCBY2,0.jpg"
                alt="STACKED TRUCKS"
              />
            </Card>

            {/* Go to owner dashboard */}
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

            {/* Go to notifications page */}
            <Card>
              <Button
                variant="contained"
                color="primary"
                onClick={this.toNotifications}
              >
                Notifications
              </Button>
            </Card>

            {/* Go to notifications page */}
            <Card>
              <Button
                variant="contained"
                color="primary"
                onClick={this.toSearchTrucks}
              >
                Search Trucks
              </Button>
            </Card>

            {/* Subscribe list */}
            <Accordion>
              <AccordionSummary>Subscribed Trucks</AccordionSummary>
              <AccordionDetails>
                <TruckListComponent
                  trucks={this.props.data.subscribedTrucks}
                  empty={
                    <Card>
                      <Button disabled={true}>No subscriptions</Button>
                    </Card>
                  }
                  handleTruckIcon={<Typography>VIEW</Typography>}
                  handleTruck={this.viewTruck}
                />
              </AccordionDetails>
            </Accordion>
          </GridListTile>

          {/** Where the map would be */}
          <GridListTile cols={4} style={{ height: "100vh" }}>
            <TruckRouteMapComponent routePts={[]} />
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

  private toNotifications() {
    Router.replace("/notifications");
  }

  private toSearchTrucks() {
    Router.replace("/search/truck");
  }
}

export default UserDashboardComponent;
