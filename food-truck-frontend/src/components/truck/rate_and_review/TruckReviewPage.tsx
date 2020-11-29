import React, {Component} from "react";
import {Button, Container, Grid, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {TruckReviews} from "../../../domain/Review";
import {loadReviewsByTruck} from "../../../api/RateReviewApi";
import {DEFAULT_ERR_KICK} from "../../../api/DefaultResponses";
import Router from "next/router";
import RatingView from "./RatingView";
import ReviewView from "./ReviewView";

interface RateProps {
    truckId: number;
}

export interface RateState {
    reviews: TruckReviews | undefined | null;
}

class TruckReviewPage extends Component<RateProps, RateState> {
    constructor(props: RateProps) {
        super(props);

        this.state = {
            reviews: undefined,
        };
        this.returnTruckPage = this.returnTruckPage.bind(this);
    }

    async componentDidMount() {
        this.setState({
            reviews: await loadReviewsByTruck(this.props.truckId, DEFAULT_ERR_KICK),
        });
    }

    render() {
        if (!this.state.reviews) {
            return (
                <Container>
                    <CircularProgress />
                </Container>
            );
        }

        return (
            <Grid container direction="column" spacing={5}>
                {this.createReviewHeader(this.state.reviews)}
                {this.state.reviews.reviews.map((review) =>
                    <Grid item key={review.reviewId + "_griditem"}>
                        <ReviewView review={review}/>
                    </Grid>
                )}
            </Grid>
        );
    }

    private createReviewHeader = (reviews: TruckReviews) => {
        const ratingsReport = (reviews.avgStarRating && reviews.avgCostRating)
            ? <RatingView starRating={reviews.avgStarRating} costRating={reviews.avgCostRating} />
            : <Typography variant="h5">Unrated</Typography>;

        return <Grid container item xs key="head">
            <Grid item xs key="back">
                <Button variant="contained" onClick={this.returnTruckPage}>Back to Truck</Button>
            </Grid>
            <Grid item xs key="name">
                <Typography variant="h4">{reviews.truckName}</Typography>
            </Grid>
            <Grid item>{ratingsReport}</Grid>
        </Grid>
    }




    private returnTruckPage() {
        Router.replace(`/truck/${this.props.truckId}`)
    }
}

export default TruckReviewPage;
