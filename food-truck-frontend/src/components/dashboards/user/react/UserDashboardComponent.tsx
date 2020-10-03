import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import State from "./UserDashboardState";
import Props from "./UserDashboardProps";
import { Paper } from "@material-ui/core";

class UserDashboardComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.viewTruck = this.viewTruck.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        {/** Props IDd using: https://material-ui.com/components/grid/ */}
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {/** Subscribed trucks as a list */}
          <Grid item xs>
            {this.props.subscribedTrucks.flatMap((name) =>
              this.createTruckEntry(name)
            )}
          </Grid>

          {/** Where the map would be */}
          <Grid item xs={12}>
                <Paper>Imagine a beautiful map with food trucks marked here...</Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  /**
   * Placeholder for listing a subscribed truck
   * @param name Name of the truck
   */
  private createTruckEntry = (name: string) => {
    return (
      <Grid container spacing={2}>
        <Grid item>{name}</Grid>
        <Grid item>
          <Button onClick={() => this.viewTruck(name)}>View</Button>
        </Grid>
      </Grid>
    );
  };

  private viewTruck(name: string): void {
    alert(`Imagine looking at ${name}, but we haven't implemented it yet...`);
  }
}

export default UserDashboardComponent;
