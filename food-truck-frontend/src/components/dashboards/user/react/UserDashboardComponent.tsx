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

import GoogleMapComponent from "../../../map";
import { SimpleTruck, UserData } from "../../../../redux/user/UserReducer";

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

            {/* Name, for debug */}
            <Card>
              <CardContent>Hello {this.props.data.username}!</CardContent>
            </Card>

            {/* Go to owner dashboard */}
            {this.props.data.ownedTrucks ? (
              <Card>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.toOwnerDashboard}
                >
                  TO OWNER DASHBOARD
                </Button>
              </Card>
            ) : null}

            {/* Subscribe list */}
            <Accordion>
              <AccordionSummary>Subscribed Trucks</AccordionSummary>
              <AccordionDetails>
                <List>
                  {this.props.data.subscribedTrucks.length > 0 ? (
                    this.props.data.subscribedTrucks.flatMap((name) =>
                      this.createTruckEntry(name)
                    )
                  ) : (
                    <ListItem>
                      <Card>No subscriptions</Card>
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </GridListTile>

          {/** Where the map would be */}
          <GridListTile cols={4} style={{ height: "100vh" }}>
            <GoogleMapComponent />
          </GridListTile>
        </GridList>
      </React.Fragment>
    );
  }

  /**
   * Placeholder for listing a subscribed truck
   * @param name Name of the truck
   */
  private createTruckEntry = (sub: SimpleTruck) => {
    return (
      <ListItem>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs>
            <Card>
              <CardContent>{sub.name}</CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Button variant="contained" onClick={() => this.viewTruck(sub.id)}>
              View
            </Button>
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  /**
   * Placeholder for viewing a truck's info
   * @param id The TruckID of the truck to view
   */
  private viewTruck(id: number): void {
    Router.replace(`/truck/${id}`);
  }

  private toOwnerDashboard() {
    Router.replace("/dashboard/owner");
  }
}

export default UserDashboardComponent;
