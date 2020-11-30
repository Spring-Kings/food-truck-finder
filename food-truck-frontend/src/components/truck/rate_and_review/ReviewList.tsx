import React, {Component} from "react";
import {Button, Container, Grid, Typography,} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Review, {TruckReviews} from "../../../domain/truck/Review";
import {loadReviewsByTruck} from "../../../api/RateReview";
import {DEFAULT_ERR_KICK} from "../../../api/DefaultResponses";
import {MoneyRating, StarRating} from "./ratings";
import Router from "next/router";

interface RateProps {
  truckId: number;
}

export interface RateState {
  reviews: TruckReviews | undefined;
}

class ReviewListComponent extends Component<RateProps, RateState> {
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
        {this.state.reviews.reviews.map((review) => this.createReviewEntry(review))}
      </Grid>
    );
  }

  private createReviewHeader = (reviews: TruckReviews) => (
    <Grid container item xs key="head">
      <Grid item xs key="back">
        <Button variant="contained" onClick={this.returnTruckPage}>Back to Truck</Button>
      </Grid>
      <Grid item xs key="name">
        <Typography variant="h4">{reviews.truckName}</Typography>
      </Grid>
      {reviews.avgStarRating !== null && reviews.avgCostRating !== null?
      this.ratingsReport(-1, reviews.avgStarRating, reviews.avgCostRating)
      : <Typography variant="h5">Unrated</Typography>}
    </Grid>
  );

  private createReviewEntry = (review: Review) => (
    <Grid item xs key={review.reviewId}>
      <Grid container key={`${review.reviewId}/cntt`} direction="column">
        <Grid item xs key={`${review.reviewId}/name`}>
          <Typography variant="h5">{review.username}</Typography>
        </Grid>
        <Grid item xs key={`${review.reviewId}/time`}>
          <Typography variant="h6">Reviewed on:</Typography>
          {review.timestamp.toLocaleDateString()}
        </Grid>

        {this.ratingsReport(review.reviewId, review.starRating, review.costRating)}

        {review.review && (
          <Grid item xs key={`${review.reviewId}/revw`}>
            <Typography variant="h6">Review:</Typography>
            {review.review}
          </Grid>
        )}
      </Grid>
    </Grid>
  );

  ratingsReport = (id: number, starRating: number, costRating: number, item: boolean = false) => (
    <Grid container item={item} key={`${id}/ratings`}>
      <Grid item xs key={"star"}>
        <Typography variant="h6">Quality:</Typography>
        <StarRating readOnly precision={0.1} disabled value={starRating}/>
      </Grid>
      <Grid item xs key={"`cost"}>
        <Typography variant="h6">Value:</Typography>
        <MoneyRating readOnly precision={0.1} disabled value={costRating}/>
      </Grid>
    </Grid>)

  private returnTruckPage() {
    Router.push(`/truck/${this.props.truckId}`)
  }
}

export default ReviewListComponent;
