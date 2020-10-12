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
import TextInputDialog from "../../../TextInputDialog";

// This is a lifesaver: https://material-ui.com/components/material-icons/
import AddIcon from "@material-ui/icons/Add";
import UserSubscription from "../../../../domain/Subscription";

class UserDashboardComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      addTruck: false,
    };

    // Bind methods
    this.viewTruck = this.viewTruck.bind(this);
    this.addTruck = this.addTruck.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        {/** Props IDd using: https://material-ui.com/components/grid/ */}
        <GridList cols={5}>
          {/** Side list */}
          <GridListTile cols={1}>
            {/* Image */}
            <Card>
              <img src="TODO insert logo" alt="STACKED TRUCKS" />
            </Card>

            {/* Subscribe list */}
            <Accordion>
              <AccordionSummary>Subscribed Trucks</AccordionSummary>
              <AccordionDetails>
                <List>
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
                </List>
              </AccordionDetails>
            </Accordion>
          </GridListTile>

          {/** Where the map would be */}
          <GridListTile cols={4}>
            <Card>
              <CardContent>
                Imagine a beautiful map with food trucks marked here...
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>

        {/** A text-input dialog */}
        <TextInputDialog
          open={this.state.addTruck}
          title="Add Truck..."
          question="Input truck name"
          submitString="Submit"
          cancelString={null}
          onSubmit={this.addTruck}
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

  /**
   * Add a truck to the subscribed list.
   * @param name The name of the truck to add
   */
  private addTruck(name: string) {
    // TODO fix here
    this.props.addTruck(name);
    this.setState({
      addTruck: false,
    });
  }
}

export default UserDashboardComponent;
