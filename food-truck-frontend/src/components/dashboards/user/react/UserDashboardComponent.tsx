import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  GridList,
  GridListTile,
  List,
  ListItem,
} from "@material-ui/core";

import State from "./UserDashboardState";
import Props from "./UserDashboardProps";

import UserSubscription from "../../../../domain/Subscription";
import GoogleMapComponent from "../../../map";

class UserDashboardComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Bind methods
    this.viewTruck = this.viewTruck.bind(this);
  }

  /**
   * Used to pull subscriptions from the backend
   */
  componentDidMount() {
    this.props.loadSubscriptions();
  }

  render() {
    return (
      <React.Fragment>
        {/** Props IDd using: https://material-ui.com/components/grid/ */}
        <GridList cols={5} style={{
          height: "100vh"
        }}>
          {/** Side list */}
          <GridListTile cols={1} style={{ height: "100vh" }}>
            {/* Image */}
            <Card>
              <img src="TODO insert logo" alt="STACKED TRUCKS" />
            </Card>

            {/* Subscribe list */}
            <Accordion>
              <AccordionSummary>Subscribed Trucks</AccordionSummary>
              <AccordionDetails>
                <List>
                  {this.props.subscribedTrucks.length > 0 ? (
                    this.props.subscribedTrucks.flatMap((name) =>
                      this.createTruckEntry(name)
                    )
                  ) : (
                    <ListItem>
                      <Card>No trucks available</Card>
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </GridListTile>

          {/** Where the map would be */}
          <GridListTile cols={4} style={{ height: "100vh" }}>
            <GoogleMapComponent/>
          </GridListTile>
        </GridList>
      </React.Fragment>
    );
  }

  /**
   * Placeholder for listing a subscribed truck
   * @param name Name of the truck
   */
  private createTruckEntry = (sub: UserSubscription) => {
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
              <CardContent>{sub.truckName}</CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Button
              variant="contained"
              onClick={() => this.viewTruck(sub.truckID)}
            >
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
    alert(`Imagine looking at ${id}, but we haven't implemented it yet...`);
  }
}

export default UserDashboardComponent;
