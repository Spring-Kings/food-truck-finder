import {Grid, Link, Typography} from "@material-ui/core";
import React from "react";
import Review from "../../../domain/truck/Review";
import {MoneyRating, StarRating} from "./ratings";
import {loadReviewById} from "../../../api/RateReview";

type Props = {
    review: Review
}

class ReviewView extends React.Component<Props, {}> {
    constructor(props: Props, context: {}) {
        super(props, context);
    }
    
    /*componentDidMount() {
        loadReviewById(this.props.review.reviewId).then(rev => {
            if (rev)
                this.setState({review: rev})
        })
    }*/

    render() {
        console.log(this.props.review);
        const username = (this.props.review.userId != -1)
            ? <Link href={`/user/${this.props.review.username}`}>{this.props.review.username}</Link>
            : this.props.review.username;

        return <Grid container key={`${this.props.review.reviewId}/cntt`} direction="column">
                <Grid item xs key={`${this.props.review.reviewId}/name`}>
                    <Typography variant="h5">
                        {username}
                    </Typography>
                </Grid>
                <Grid item xs key={`${this.props.review.reviewId}/time`}>
                    <Typography variant="h6">Reviewed on:</Typography>
                    {this.props.review.timestamp.toLocaleDateString()}
                </Grid>

                {this.ratingsReport(this.props.review.reviewId, this.props.review.starRating, this.props.review.costRating)}

                {this.props.review.review && (
                    <Grid item xs key={`${this.props.review.reviewId}/revw`}>
                        <Typography variant="h6">Review:</Typography>
                        {this.props.review.review}
                    </Grid>
                )}
            </Grid>
    }

    ratingsReport = (id: number, starRating: number, costRating: number, item: boolean = false) => (
        <Grid container item={item} key={`${id}/ratings`}>
            <Grid item xs key={`${id}/star`}>
                <Typography variant="h6">Quality:</Typography>
                <StarRating readOnly precision={0.1} disabled value={starRating}/>
            </Grid>
            <Grid item xs key={`${id}/cost`}>
                <Typography variant="h6">Value:</Typography>
                <MoneyRating readOnly precision={0.1} disabled value={costRating}/>
            </Grid>
        </Grid>)
}

export default ReviewView