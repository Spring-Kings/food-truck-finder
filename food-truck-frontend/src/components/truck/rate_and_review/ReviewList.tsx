import React, { Component } from "react";
import {
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Review from "../../../domain/truck/Review";
import { loadReviewsByTruck } from "../../../api/RateReview";
import { DEFAULT_ERR_KICK } from "../../../api/DefaultResponses";
import { MoneyRating, StarRating } from "./ratings";

interface RateProps {
  truckId: number;
}

export interface RateState {
  reviews: Review[];
}

class ReviewListComponent extends Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props);

    this.state = {
      reviews: [],
    };
    this.setState = this.setState.bind(this);
  }

  async componentDidMount() {
    this.setState({
      reviews: await loadReviewsByTruck(this.props.truckId, DEFAULT_ERR_KICK),
    });
  }

  render() {
    if (!this.state) {
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    }

    return (
      <Grid container direction="column">
        {this.createReviewHeader()}
        {this.state.reviews.map((review) => this.createReviewEntry(review))}
      </Grid>
    );
  }

  private createReviewHeader = () => (
    /** TODO put title, overall stars, overall cost here */
    <Grid container item xs key="head">
      <Grid item xs key="name">
        <Typography variant="h4">{/** TODO put title here */}</Typography>
      </Grid>
      <Grid item xs key="star">
        Star Rating
      </Grid>
      <Grid item xs key="cost">
        Cost Rating
      </Grid>
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

        {/* I can't believe that actually worked */}
        <Grid container item xs key={`${review.reviewId}/basics`}>
          <Grid item xs key={`${review.reviewId}/star`}>
            <Typography variant="h6">Quality:</Typography>
            <StarRating disabled value={review.starRating} />
          </Grid>
          <Grid item xs key={`${review.reviewId}/cost`}>
            <Typography variant="h6">Value:</Typography>
            <MoneyRating disabled value={review.costRating} />
          </Grid>
        </Grid>

        {review.review && (
          <Grid item xs key={`${review.reviewId}/revw`}>
            <Typography variant="h6">Review:</Typography>
            {review.review}
          </Grid>
        )}
        <Grid item key="br">
          <br />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ReviewListComponent;
