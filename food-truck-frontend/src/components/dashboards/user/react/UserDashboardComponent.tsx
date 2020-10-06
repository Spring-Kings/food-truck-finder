import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";

import State from "./UserDashboardState";
import Props from "./UserDashboardProps";
import TextInputDialog from "../../../TextInputDialog";

// This is a lifesaver: https://material-ui.com/components/material-icons/
import AddIcon from "@material-ui/icons/Add";

class UserDashboardComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      addTruck: false
    };
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
            <Button
              onClick={() =>
                this.setState({
                  addTruck: true,
                })
              }
            >
              <AddIcon />
            </Button>
          </Grid>

          {/** Where the map would be */}
          <Grid item xs={12}>
            <Paper>
              Imagine a beautiful map with food trucks marked here...
            </Paper>
          </Grid>
        </Grid>

        {/** A text-input dialog */}
        <TextInputDialog
          open={this.state.addTruck}
          title="Add Truck..."
          question="Input truck name"
          submitString="Submit"
          cancelString={null}
          onSubmit={this.props.addTruck}
          onCancel={() =>
            this.setState({
              addTruck: false,
            })
          }
        />
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
          <Button onClick={() => this.props.viewTruck(name)}>View</Button>
        </Grid>
      </Grid>
    );
  };

  /**
   * Placeholder for viewing a truck's info
   * @param name The name of the truck to view
   */
  private viewTruck(name: string): void {
    alert(`Imagine looking at ${name}, but we haven't implemented it yet...`);
  }
}

export default UserDashboardComponent;
