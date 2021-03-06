import React, {Component} from "react";
import {Button, Card, CardContent, CardHeader, Container, Grid, GridList, GridListTile, Link, List, ListItem, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Router from "next/router";
import loggedInUser from "../util/token";
import TruckRouteMapComponent from "./map";
import {RouteLocation} from "../domain/RouteLocation";

import {DEFAULT_ERR_RESP} from "../api/DefaultResponses";
import {loadCurrentRoute} from "../api/RouteLocationApi";
import SendNotificationComponent from "./notifications/SendNotificationComponent";
import {getSubscriptionForTruck, subscribeToTruck, unsubscribeFromTruck} from "../api/SubscriptionApi";
import ImageDialog from "./util/ImageDialog";
import {MoneyRating, StarRating} from "./truck/rate_and_review/ratings";
import TruckRatingComponent from "./truck/TruckRatingComponent";
import RoutesView from "./map/route-map/RoutesView";
import Truck from "../domain/Truck";
import Subscription from "../domain/Subscription";
import {getTruckById} from "../api/TruckApi";
import NextLink from 'next/link'
import {getUsername} from "../api/UserApi";

export const userCanEditTruck = (truckOwnerId: number): boolean => {
  const user = loggedInUser();
  if (user) {
    return truckOwnerId === user.userID;
  }
  return false;
};

export interface TruckProps {
  truckId: number;
}

type State = {
  truck: Truck | null;
  ownerName: string;
  routePts: RouteLocation[] | null;
  subscription: Subscription | null;
  err: string | null;
};

class TruckView extends Component<TruckProps, State> {
  constructor(props: TruckProps) {
    super(props);

    this.state = {
      truck: null,
      err: null,
      routePts: [],
      subscription: null,
      ownerName: ""
    };
  }

  async componentDidMount() {
    try {
      const truck = await getTruckById(this.props.truckId, DEFAULT_ERR_RESP);
      if (truck === null) {
        this.setState({err: "Couldn't get truck"});
        return;
      }

      const ownerName = await getUsername(truck.userId) ?? "Unknown";
      const sub = await getSubscriptionForTruck(this.props.truckId);
      const routePts = await loadCurrentRoute(this.props.truckId, DEFAULT_ERR_RESP);

      this.setState({subscription: sub, routePts, truck, ownerName})

    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (this.state.err) {
      return <p>{this.state.err}</p>
    } else if (!this.state.truck) {
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
          {this.state.truck.description}
        </Grid>
      </Grid>
    );

    const ownerLink = (
      this.state.ownerName === 'Anonymous'
        ? <Typography>Owned by an anonymous user</Typography>
        : <Button onClick={() => Router.push(`/user/${this.state.ownerName}`)}>{`View Owner ${this.state.ownerName}'s Profile`}</Button>
    )

    const priceRating = this.state.truck.priceRating ?
      <TruckRatingComponent name="Price Rating:"
                            child={<MoneyRating readOnly precision={0.1} value={this.state.truck.priceRating}/>}/>
      : <></>;
    const starRating = this.state.truck.starRating ?
      <TruckRatingComponent name="Star Rating:"
                            child={<StarRating readOnly precision={0.1} value={this.state.truck.starRating}/>}/>
      : <></>;

    const tags = (
      <>
        <Typography variant="subtitle1">Tags:</Typography>
        <List>
          {this.state.truck.tags.map((tag: string, _ndx: number) => <ListItem
            key={`${this.props.truckId}-${tag}`}>{tag}</ListItem>)}
        </List>
      </>
    );

    const reviewButton = (
      <ListItem key={`${this.props.truckId}-reviewBtn`}>
        <Button color="primary" onClick={this.reviewTruck}>Leave Review</Button>
      </ListItem>
    );

    const subscribeButton = (
      <ListItem key={`${this.props.truckId}-subscribeBtn`}>
        <Button color="primary"
                onClick={this.handleSubscription}>
          {this.state.subscription == null ? "Subscribe" : "Unsubscribe"}
        </Button>
      </ListItem>
    );

    const menuUrl = `${process.env.S3_URL}/menu/${this.props.truckId}`;
    let menuButton;
    if (this.state.truck.menuContentType === 'application/pdf')
      menuButton = <Button><Link href={menuUrl} color="initial">View Menu PDF</Link></Button>
    else
      menuButton = <ImageDialog url={menuUrl} text={`${this.state.truck.name} Menu`}/>

    const viewReviewsButton = (
      <Button color="primary" onClick={this.readReviews}>Read Reviews</Button>
    );

    const viewSubscribersButton = (
      <Button color="primary" onClick={this.viewSubscribers}>View Subscribers</Button>
    );

    const truckInfo = [
      description,
      priceRating,
      starRating,
      tags,
      menuButton,
      viewReviewsButton,
      viewSubscribersButton,
      ownerLink
    ];

    const truckInfoView = (
      <Card>
        <CardHeader title={this.state.truck.name}/>
        <CardContent>
          <List>
            {this.state.truck !== null && truckInfo.map((el, index) => (
              <ListItem key={`${this.state.truck?.id}-${index}`}>
                {el}
              </ListItem>
            ))}
            {this.state.truck !== null && !userCanEditTruck(this.state.truck.userId) && loggedInUser() !== null &&
            <>
              {reviewButton}
              {subscribeButton}
            </>
            }
          </List>
        </CardContent>
      </Card>
    );

    const ownerButtons = (
      <Card>
        <CardHeader title="Owner Zone"/>
        <CardContent>
          <Grid container>
            <Grid item>
              <Button color="primary"
                      onClick={this.editTruck}>
                Edit Truck
              </Button>
            </Grid>
            <Grid item>
              <Grid container spacing={0}>
                <Grid item>
                  <Typography variant="subtitle1">Send Notification To Subscribers:</Typography>
                </Grid>
                <Grid item>
                  <SendNotificationComponent truckId={this.props.truckId}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );

    return (
      <GridList cols={6}
                spacing={8}
                style={{
                  height: "auto",
                  width: "100%",
                }}>
        <GridListTile cols={2} style={{ height: 'auto' }}>
          {truckInfoView}
        </GridListTile>
        {userCanEditTruck(this.state.truck.userId) && 
        <GridListTile cols={2} style={{ height: 'auto' }}>
          {ownerButtons}
        </GridListTile>
        }
        <GridListTile cols={6} style={{ height: 'auto' }}>
          <RoutesView truckId={this.state.truck.id}/>
        </GridListTile>
      </GridList>
    );
  }

  editTruck = () => {
    Router.push(`/truck/edit/${this.props.truckId}`);
  };

  reviewTruck = () => {
    Router.push(`/truck/reviews/create/${this.props.truckId}`);
  };

  readReviews = () => {
    Router.push(`/truck/reviews/${this.props.truckId}`);
  };

  viewSubscribers = () => {
    Router.push(`/truck/subscribers/${this.props.truckId}`);
  };

  handleSubscription = () => {
    if (this.state.subscription != null) {
      unsubscribeFromTruck(this.props.truckId).then(() => {
      });
      this.setState({
        ...this.state,
        subscription: null,
      });
    } else {
      subscribeToTruck(this.props.truckId).then((sub) => {
        this.setState({
          ...this.state,
          subscription: sub
        });
      });
    }
  }
}

export default TruckView;
