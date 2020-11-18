import React, {Component} from "react";
import {Button, Container, Grid, List, ListItem, Typography,} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotFound from "./NotFound";
import api from "../util/api";
import Router from "next/router";
import getUserInfo from "../util/token";
import TruckRouteMapComponent from "./map";
import {RouteLocation} from "./map/route-map/RouteLocation";

import {DEFAULT_ERR_RESP} from "../api/DefaultResponses";
import {loadTodaysRoute} from "../api/RouteLocation";
import SendNotificationComponent from "./notifications/SendNotificationComponent";
import {getSubscriptionForTruck, subscribeToTruck, Subscription, unsubscribeFromTruck} from "../api/Subscription";
import LinkButton from "./layout/LinkButton";

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
  tags: string[];
  menuContentType: string | null;
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
      tags: [],
      menuContentType: null
    };
  }

  async componentDidMount() {
    try {
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
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (!this.state) {
      return <NotFound/>;
    } else if (this.state.id < 1) {
      return (
          <Container>
            <CircularProgress/>
          </Container>
      );
    }

    let menuImage = null;
    const menuUrl = `${process.env.FOOD_TRUCK_API_URL}/truck/${this.state.id}/menu`;
    if (this.state.menuContentType === 'application/pdf')
      menuImage = <ListItem><LinkButton url={menuUrl} text="View Menu"/></ListItem>;
    else if (this.state.menuContentType?.startsWith('image/'))
      menuImage = <ListItem><img alt="Menu" src={menuUrl}/></ListItem>;

    const nonOwnerStuff = [
      <ListItem>
        <Button color="primary"
                onClick={this.handleSubscription}>
          {this.state.subscription == null ? "Subscribe" : "Unsubscribe"}
        </Button>
      </ListItem>,
      <ListItem>
        <Button color="primary" onClick={this.reviewTruck}>Leave Review</Button>
      </ListItem>
    ];
    const ownerStuff = [
      <ListItem>
        <Button color="primary" onClick={this.editTruck}>
          Edit
        </Button>
      </ListItem>,
      <ListItem>Send Notification To Subscribers:</ListItem>,
      <ListItem>
        <SendNotificationComponent truckId={this.state.id}/>
      </ListItem>
    ];


    return (
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">{this.state.name}</Typography>
            <List>
              {menuImage}
              <ListItem>
                Description: {this.state.description}
              </ListItem>
              <ListItem>
                Price Rating: {this.state.priceRating}
              </ListItem>
              <ListItem>
                Tags: {this.state.tags.join(', ')}
              </ListItem>

              {userCanEditTruck(this.state.userId) ? ownerStuff : nonOwnerStuff}
              <ListItem>
                <Button color="primary" onClick={this.readReviews}>Read Reviews</Button>
              </ListItem>

            </List>
          </Grid>
          <Grid item xs={12}>
            <TruckRouteMapComponent locations={this.state.routePts}/>
          </Grid>
        </Grid>
    );
  }

  editTruck = () => {
    Router.replace(`/truck/edit/${this.state.id}`);
  };
  
  reviewTruck = () => {
    Router.replace(`/truck/reviews/create/${this.state.id}`);
  };

  readReviews = () => {
    Router.replace(`/truck/reviews/${this.state.id}`);
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
