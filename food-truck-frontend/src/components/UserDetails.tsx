import React from 'react';
import ReviewsList from "./ReviewsList";
import SubscriptionList from "./SubscriptionList";
import api from "../util/api";
import {User, queryUserByName} from "../api/User";
import Review from "../domain/truck/Review";
import {loadReviewsByUser} from "../api/RateReview";
import ReviewView from "./truck/rate_and_review/ReviewView";

type UserDetailsProps = {
    username: string
}

type UserDetailsState = {
    user: User|null,
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
        const user = await queryUserByName(this.props.username);
        if (user == null) {
            this.setState({err: "User not found."});
            return;
        }
        const reviews = await loadReviewsByUser(user.id, () => {
            this.setState({err: "Failed to fetch reviews."})
        });
        this.setState({reviews});
    }

    render() {
        if (this.state.err)
            return <p>{this.state.err}</p>

        return(
            <div>
                <h1>{this.props.username}</h1>
                {this.state.reviews?.map(rev => <ReviewView key={rev.reviewId + "_view"} review={rev}/>)}
                <br/>
                <SubscriptionList username={this.props.username}/>
            </div>
        );
    }
}

export default UserDetails;