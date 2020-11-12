import React from "react";
import Router from "next/router";

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
  IconButton,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import TruckRouteMapComponent from "../../map";

import TruckListComponent from "../TruckListComponent";
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
            {/* Return to user dashboard */}
            <Card>
              <Button
                variant="contained"
                color="primary"
                onClick={this.toUserDashboard}
              >
                USER DASHBOARD
              </Button>
            </Card>

            {/* Subscribe list */}
            <Accordion>
              <AccordionSummary>My Trucks</AccordionSummary>
              <AccordionDetails>
                <TruckListComponent
                  trucks={this.props.data.ownedTrucks}
                  tail={
                    <Card>
                      <Button
                        variant="contained"
                        onClick={() => Router.replace("/create-truck")}
                      >
                        New...
                      </Button>
                    </Card>
                  }
                  handleTruckIcon={<Typography>View</Typography>}
                  handleTruck={this.viewTruck}
                />
              </AccordionDetails>
            </Accordion>

            {/* Open manager page */}
            <Card>
              <Button
                variant="contained"
                onClick={() => Router.replace("/manage-trucks")}
              >
                Manage trucks
              </Button>
            </Card>
          </GridListTile>

          {/** Where the map would be */}
          <GridListTile cols={4} style={{ height: "100vh" }}>
            <TruckRouteMapComponent locations={[]} />
          </GridListTile>
        </GridList>
      </React.Fragment>
    );
  }

  private viewTruck(id: number): void {
    Router.replace(`/truck/${id}`);
  }

  private toUserDashboard() {
    Router.replace("/dashboard/user");
  }
}

export default OwnerDashboardComponent;
