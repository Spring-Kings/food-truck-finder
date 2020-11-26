import React, {Component} from "react";
import {Button, Container, Grid, Link, List, ListItem, Typography,} from "@material-ui/core";
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
import ImageDialog from "./util/ImageDialog";
import {MoneyRating, StarRating} from "./truck/rate_and_review/ratings";
import TruckRatingComponent from "./truck/TruckRatingComponent";

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
  menuContentType: string | null;
}

export const makeEmptyTruckState = (): TruckState => {
  return {
    id: 0,
    userId: 0,
    name: "",
    description: "",
    priceRating: null,
    tags: [],
    starRating: null,
    menuContentType: null
  };
};

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
      ...makeEmptyTruckState(),
      notFound: null,
      routePts: [],
      subscription: null,
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

    const description = (
      <Grid container justify="flex-start" alignItems="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="subtitle1">Description:</Typography>
        </Grid>
        <Grid item style={{maxWidth: '250px'}}>
          {this.state.description}
        </Grid>
      </Grid>
    );

    const priceRating = this.state.priceRating ?
      <TruckRatingComponent name="Price Rating:"
                            child={<MoneyRating readOnly precision={0.1} value={this.state.priceRating}/>}/>
       : <></>;
    const starRating = this.state.starRating ?
      <TruckRatingComponent name="Star Rating:"
                            child={<StarRating readOnly precision={0.1} value={this.state.starRating}/>}/>
       : <></>;

    const tags = (
      <>
        <Typography variant="subtitle1">Tags:</Typography>
        <List>
          {this.state.tags.map((tag, _ndx) => <ListItem key={`${this.state.id}-${tag}`}>{tag}</ListItem>)}
        </List>
      </>
    );

    const reviewButton = (
      <ListItem key={`${this.state.id}-reviewBtn`}>
        <Button color="primary" onClick={this.reviewTruck}>Leave Review</Button>
      </ListItem>
    );

    const subscribeButton = (
      <ListItem key={`${this.state.id}-subscribeBtn`}>
        <Button color="primary"
                onClick={this.handleSubscription}>
          {this.state.subscription == null ? "Subscribe" : "Unsubscribe"}
        </Button>
      </ListItem>
    );

    const menuUrl = `${process.env.FOOD_TRUCK_API_URL}/truck/${this.state.id}/menu`;
    let menuButton;
    if (this.state.menuContentType === 'application/pdf')
      menuButton = <Button><Link href={menuUrl} color="initial">View Menu PDF</Link></Button>
    else
      menuButton = <ImageDialog url={menuUrl} text={`${this.state.name} Menu`}/>

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
          {truckInfo.map((el, index) => (
            <ListItem key={`${this.state.id}-${index}`}>
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
