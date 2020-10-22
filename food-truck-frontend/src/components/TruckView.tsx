import React, { Component } from "react";
import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotFound from "./NotFound";
import api from "../util/api";
import Router from "next/router";
import getUserInfo from "../util/token";
import TruckRouteMapComponent from "./map";
import { RouteLocation } from "./map/route-map/RouteLocation";

import { DEFAULT_ERR_RESP } from "../api/DefaultResponses";
import { loadTodaysRoute } from "../api/RouteLocation";

export const userCanEditTruck = (truckOwnerId: number): boolean => {
  const user = getUserInfo();
  if (user) {
    if (truckOwnerId !== user.userID) {
      return false;
    } else {
      return true;
    }
  }
  return false;
};

export interface TruckState {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  priceRating: number | null;
  foodCategory: string | null;
  // menu: string | null;
  textMenu: string | null;
  // schedule: string | null;
  routePts: RouteLocation[];
}

interface TruckViewState {
  notFound: boolean | null;
}

export interface TruckProps {
  truckId: number;
}

type State = TruckState & TruckViewState;

class TruckView extends Component<TruckProps, State> {
  constructor(props: TruckProps) {
    super(props);

    this.state = {
      notFound: null,
      id: 0,
      userId: 0,
      name: "",
      description: null,
      priceRating: null,
      foodCategory: null,
      textMenu: null,
      routePts: []
    };
  }

  async componentDidMount() {
    await api
      .get(`/truck/${this.props.truckId}`, {})
      .then((res) => this.setState(res ? res.data : null))
      .catch((err) => {
        if (err.response) {
          console.log("Got error response code");
        } else if (err.request) {
          console.log("Did not receive Truck response");
        } else {
          console.log(err);
        }
        this.setState(null);
      });

    // Load today's route
    this.setState({ routePts: await loadTodaysRoute(this.props.truckId, DEFAULT_ERR_RESP) });
  }

  render() {
    if (!this.state) {
      return <NotFound />;
    } else if (this.state.id < 1) {
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    }

    return (
      <Grid container direction="row">
        <Grid item xs>
        <Typography variant="h4">{this.state.name}</Typography>
        <List>
          <ListItem>
            Truck Description: {this.state.description}
          </ListItem>
          <ListItem>
            Price Rating: {this.state.priceRating}
          </ListItem>
          <ListItem>
            Food Category: {this.state.foodCategory}
          </ListItem>
          <ListItem>
            Text Menu: {this.state.textMenu}
          </ListItem>
        </List>
        {userCanEditTruck(this.state.userId) &&
          <Button variant="outlined"
                  color="primary"
                  onClick={this.editTruck}>
            Edit
          </Button>
        }        </Grid>
        <Grid item xs>
          <TruckRouteMapComponent routePts={this.state.routePts} />
        </Grid>
      </Grid>
    );
  }

  editTruck = () => {
    Router.replace(`/truck/edit/${this.state.id}`);
  };
}

export default TruckView;
