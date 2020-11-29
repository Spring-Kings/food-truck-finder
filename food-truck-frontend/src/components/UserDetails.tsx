import React from 'react';
import SubscriptionList from "./SubscriptionList";
import {User} from "../domain/User";
import Review from "../domain/Review";
import {loadReviewsByUser} from "../api/RateReviewApi";
import ReviewView from "./truck/rate_and_review/ReviewView";
import {Grid} from "@material-ui/core";
import {loadUserByName} from "../api/UserApi";

type UserDetailsProps = {
    username: string
}

type UserDetailsState = {
    user: User | null,
    reviews: Review[]|null
    err: string|null
}

class UserDetails extends React.Component<UserDetailsProps, UserDetailsState>{
    constructor(props: UserDetailsProps) {
        super(props);
        this.state = {
            user: null,
            reviews: null,
            err: null
        }
    }

    async componentDidMount() {
        const user = await loadUserByName(this.props.username);
        if (user == null) {
            this.setState({err: "User not found."});
            return;
        }

        const reviews = await loadReviewsByUser(user.id, () => {
            this.setState({err: "Failed to fetch reviews."})
        });
        this.setState({user, reviews});
    }

    render() {
        if (this.state.err)
            return <p>{this.state.err}</p>
        if (this.state.user == null)
            return <p>Please wait...</p>

        return(
            <div>
                <h1>{this.props.username}</h1>
                <h2>Reviews</h2>
                <Grid container>
                    {this.state.reviews?.map(rev =>
                        <Grid item key={rev.reviewId + "_view"}>
                            <ReviewView review={rev}/>
                        </Grid>
                    )}
                </Grid>

                <SubscriptionList username={this.props.username}/>
            </div>
        );
    }
}

export default UserDetails;