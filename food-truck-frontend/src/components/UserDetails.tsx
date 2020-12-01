import React from 'react';
import {loadReviewsByUser} from "../api/RateReviewApi";
import ReviewView from "./truck/rate_and_review/ReviewView";
import {Grid} from "@material-ui/core";
import {loadSubscriptionsForUser, loadUserByName} from "../api/UserApi";
import Review from "../domain/Review";
import User from "../domain/User";
import Truck from "../domain/Truck";
import {List, ListItem} from 'material-ui';

type UserDetailsProps = {
    username: string
}

type UserDetailsState = {
    user: User | null,
    reviews: Review[] | null,
    subscribedTrucks: Truck[] | null,
    err: string | null
}

class UserDetails extends React.Component<UserDetailsProps, UserDetailsState>{
    constructor(props: UserDetailsProps) {
        super(props);
        this.state = {
            user: null,
            reviews: null,
            subscribedTrucks: null,
            err: null
        }
    }

    async componentDidMount() {
        const user = await loadUserByName(this.props.username);
        if (user == null) {
            this.setState({err: "User not found."});
            return;
        }

        const reviewsTask = loadReviewsByUser(user.id, () => {
            this.setState({err: "Failed to fetch reviews."})
        });
        const subscriptionsTask = loadSubscriptionsForUser(this.props.username);

        const reviews = await reviewsTask;
        const subs = await subscriptionsTask;

        if (reviews == null || subs == null) {
            this.setState({err: "Failed to load user data"});
        }

        this.setState({user, reviews, subscribedTrucks: subs});
    }

    render() {
        if (this.state.err)
            return <p>{this.state.err}</p>
        if (this.state.user == null || this.state.reviews == null || this.state.subscribedTrucks == null)
            return <p>Please wait...</p>


        return(
          <>
              <h1>{this.props.username}</h1>
              <h2>Reviews</h2>
              {
                  this.state.reviews.length > 0 ?
                    <Grid container>
                        {this.state.reviews.map(rev =>
                          <Grid item key={rev.reviewId + "_view"}>
                              <ReviewView review={rev}/>
                          </Grid>
                        )}
                    </Grid>
                    :
                    <p>No reviews.</p>
              }


              <h2>Subscriptions</h2>
              {
                  this.state.subscribedTrucks.length > 0 ?
                    <List>
                        {this.state.subscribedTrucks.map(t =>
                          // @ts-ignore: see https://github.com/mui-org/material-ui/issues/14971
                          <ListItem key={t.id} button component="a" href={`/truck/${t.id}`}>{t.name}</ListItem>
                        )}
                    </List>
                    :
                    <p>No subscriptions.</p>
              }

          </>
        );
    }
}

export default UserDetails;