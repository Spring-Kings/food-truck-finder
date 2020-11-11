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
import SendNotificationComponent from "./notifications/SendNotificationComponent";
import {getSubscriptionForTruck, subscribeToTruck, unsubscribeFromTruck} from "../api/Subscription";
import {Subscription} from "../api/Subscription";
import {getSortedUsageRows} from "@jest/core/build/lib/watch_plugins_helpers";

export const userCanEditTruck = (truckOwnerId: number): boolean => {
  const user = getUserInfo();
  if (user) {
    return truckOwnerId === user.userID;
  }
  return false;
};

export interface TruckState {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  priceRating: number | null;
  tags: string[]
}

interface TruckViewState {
  notFound: boolean | null;
}

export interface TruckProps {
  truckId: number;
}

type State = TruckState & TruckViewState & {
  routePts: RouteLocation[];
  subscription: Subscription | null;
};

class TruckView extends Component<TruckProps, State> {
  constructor(props: TruckProps) {
    super(props);

    this.state = {
      notFound: null,
      id: 0,
      userId: 0,
      name: "",
      description: "",
      priceRating: -1,
      routePts: [],
      subscription: null,
      tags: []
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

    await getSubscriptionForTruck(this.props.truckId).then((sub) => {
      this.setState({
        ...this.state,
        subscription: sub
      })
    });

    // Load today's route
    this.setState({
      ...this.state,
      routePts: await loadTodaysRoute(this.props.truckId, DEFAULT_ERR_RESP),
    });
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
              <img src={`${process.env.FOOD_TRUCK_API_URL}/truck/${this.state.id}/menu`} alt="Menu"/>
            </ListItem>
            <ListItem>
              Description: {this.state.description}
            </ListItem>
            <ListItem>
              Price Rating: {this.state.priceRating}
            </ListItem>
            <ListItem>
              Tags:
              <List>
                {this.state.tags.map((tag, ndx) => <ListItem key={ndx}>{tag}</ListItem>)}
              </List>
            </ListItem>
          </List>
          <Grid>
            {!userCanEditTruck(this.state.userId) &&
              <Button variant="outlined"
                      color="primary"
                      onClick={this.handleSubscription}>
                {this.state.subscription == null ? "Subscribe" : "Unsubscribe"}
              </Button>
            }
            {userCanEditTruck(this.state.userId) &&
              <>
                <Button variant="outlined"
                        color="primary"
                        onClick={this.editTruck}>
                  Edit
                </Button>
                <Grid>
                  {"Send Notification To Subscribers:"}
                  <SendNotificationComponent truckId={this.state.id}/>
                </Grid>
              </>
            }
          </Grid>
        </Grid>
        <Grid item xs>
          <TruckRouteMapComponent routePts={this.state.routePts} />
        </Grid>
      </Grid>
    );
  }

  editTruck = () => {
    Router.replace(`/truck/edit/${this.state.id}`);
  };

  handleSubscription = () => {
    if (this.state.subscription != null) {
      unsubscribeFromTruck(this.state.id).then(() => {});
      this.setState({
        ...this.state,
        subscription: null,
      });
    } else {
      subscribeToTruck(this.state.id).then((sub) => {
        this.setState({
          ...this.state,
          subscription: sub
        });
      });
    }
  }
}

export default TruckView;
