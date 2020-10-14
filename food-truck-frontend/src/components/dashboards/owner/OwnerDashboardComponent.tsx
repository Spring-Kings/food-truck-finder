import {
  GridList,
  GridListTile,
  Card,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Grid,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  CardActionArea,
} from "@material-ui/core";
import React from "react";
import GoogleMapComponent from "../../map";

import Router from "next/router";
import { SimpleTruck, UserData } from "../../../redux/user/UserReducer";

interface OwnerDashboardProps {
  data: UserData | undefined;
  readonly [x: string]: any;
}

interface OwnerDashboardState {
  inError: string | null;
}

class OwnerDashboardComponent extends React.Component<
  OwnerDashboardProps,
  OwnerDashboardState
> {
  constructor(props: OwnerDashboardProps) {
    super(props);

    this.state = {
      inError: null,
    };

    // Bind methods
    this.viewTruck = this.viewTruck.bind(this);
    this.toUserDashboard = this.toUserDashboard.bind(this);
  }

  /**
   * Used to pull subscriptions from the backend
   */
  componentDidMount() {
    this.props.loadUserFromBackend().then(
      (_response: any) => this.setState({ inError: null }),
      (err: any) => this.setState({ inError: err })
    );
  }

  render() {
    // Be safe: don't show to people who don't deserve it. Of course you can hack and bypass it,
    // but it looks better to our "customers"
    // Uh, who's paying for this thing again?
    if (this.props.data === undefined)
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    else if (this.state.inError)
      return (
        <Container>
          <Typography variant="h2">Error</Typography>
          <Typography>{this.state.inError}</Typography>
        </Container>
      );
    else if (!this.props.data.ownedTrucks)
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
              <img src="TODO insert logo" alt="STACKED TRUCKS" />
            </Card>

            {/* Return to user dashboard */}
            <Card>
              <Button variant="contained" color="primary" onClick={this.toUserDashboard}>USER DASHBOARD</Button>
            </Card>

            {/* Subscribe list */}
            <Accordion>
              <AccordionSummary>My Trucks</AccordionSummary>
              <AccordionDetails>
                <List>
                  {this.props.data.ownedTrucks.length > 0 ? (
                    this.props.data.ownedTrucks.flatMap((name) =>
                      this.createTruckEntry(name)
                    )
                  ) : (
                    <ListItem>
                      <Card>
                        <Button onClick={() => Router.replace("/manage-trucks")}>Manage trucks</Button>
                      </Card>
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

  private toUserDashboard() {
    Router.replace("/dashboard/user");
  }
}

export default OwnerDashboardComponent;
