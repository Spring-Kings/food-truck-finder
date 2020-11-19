import React, { Component } from "react";
import {
  Box,
  Button,
  Container, Dialog,
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
import ImageDialog from "./util/ImageDialog";
import {MoneyRating, StarRating} from "./truck/rate_and_review/ratings";

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
  starRating: number | null;
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
      priceRating: null,
      routePts: [],
      subscription: null,
      tags: [],
      starRating: null,
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
      return <NotFound />;
    } else if (this.state.id < 1) {
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    }

    const description = (
      <Grid container justify="flex-start" alignItems="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="subtitle1">Description:</Typography>
        </Grid>
        <Grid item>
          {this.state.description}
        </Grid>
      </Grid>
    );

    const rating = (name: string, child: JSX.Element) => (
      <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="subtitle1">{name}</Typography>
        </Grid>
        <Grid item>
          {child}
        </Grid>
      </Grid>
    );

    const priceRating = this.state.priceRating ?
      rating("Price Rating:", <MoneyRating precision={0.1} disabled value={this.state.priceRating} />) : <></>;
    const starRating = this.state.starRating ?
      rating("Star Rating:", <StarRating precision={0.1} disabled value={this.state.starRating} />) : <></>;

    const tags = (
      <>
        <Typography variant="subtitle1">Tags:</Typography>
        <List>
          {this.state.tags.map((tag, ndx) => <ListItem key={ndx}>{tag}</ListItem>)}
        </List>
      </>
    );

    const reviewButton = (
      <ListItem>
        <Button color="primary" onClick={this.reviewTruck}>Leave Review</Button>
      </ListItem>
    );

    const subscribeButton = (
      <ListItem>
        <Button color="primary"
                onClick={this.handleSubscription}>
          {this.state.subscription == null ? "Subscribe" : "Unsubscribe"}
        </Button>
      </ListItem>
    );

    const menuButton = (
      <ImageDialog url={`${process.env.FOOD_TRUCK_API_URL}/truck/${this.state.id}/menu`}
                   text={`${this.state.name} Menu`}/>
    );

    const viewReviewsButton = (
      <Button color="primary" onClick={this.readReviews}>Read Reviews</Button>
    );

    const truckInfo = [
      description,
      priceRating,
      starRating,
      tags,
      menuButton,
      viewReviewsButton
    ];

    const truckInfoView = (
      <Grid item>
        <Typography variant="h4">{this.state.name}</Typography>
        <List>
          {truckInfo.map(el => (
            <ListItem>
              {el}
            </ListItem>
          ))}
          {!userCanEditTruck(this.state.userId) && getUserInfo() !== null &&
          <>
            {reviewButton}
            {subscribeButton}
          </>
          }
        </List>
      </Grid>
    );

    const ownerButtons = (
      <>
        <Grid item>
          <Typography variant="h4">Owner Zone</Typography>
        </Grid>
        <Grid item>
          <Button color="primary"
                  onClick={this.editTruck}>
            Edit
          </Button>
        </Grid>
        <Grid item>
          <Grid container spacing={0}>
            <Grid item>
              <Typography variant="subtitle1">Send Notification To Subscribers:</Typography>
            </Grid>
            <Grid item>
              <SendNotificationComponent truckId={this.state.id}/>
            </Grid>
          </Grid>
        </Grid>
      </>
    );

    return (
      <Grid container justify="flex-start" alignItems="flex-start">
        <Grid container direction="row" justify="flex-start" align-items="flex-start">
          {truckInfoView}
          <Grid item xs>
            <TruckRouteMapComponent locations={this.state.routePts} height="50vh"/>
          </Grid>
        </Grid>
        {userCanEditTruck(this.state.userId) && ownerButtons}
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
