import React, { Component } from "react";
import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Review from "../../../domain/truck/Review";
import { loadReviewsByTruck } from "../../../api/RateReview";
import { DEFAULT_ERR_KICK } from "../../../api/DefaultResponses";
import NotFound from "../../NotFound";

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

    return <Grid container direction="column">
      {this.createReviewHeader()}
      {this.state.reviews.map(review => this.createReviewEntry(review))}
    </Grid>;
  }

  private createReviewHeader = () => (
    <Grid item xs key="head">
      <Grid container key="cntt" direction="row">
        <Grid item xs key="name">Reviewer</Grid>
        <Grid item xs key="star">Star Rating</Grid>
        <Grid item xs key="cost">Cost Rating</Grid>
        <Grid item xs key="revw">Review</Grid>
        <Grid item xs key="time">Date</Grid>
      </Grid>
    </Grid>
  );

  private createReviewEntry = (review: Review) => (
    <Grid item xs key={review.reviewId}>
      <Grid container key={`${review.reviewId}/cntt`} direction="row">
        <Grid item xs key={`${review.reviewId}/name`}>{review.username}</Grid>
        <Grid item xs key={`${review.reviewId}/star`}>{review.starRating}</Grid>
        <Grid item xs key={`${review.reviewId}/cost`}>{review.costRating}</Grid>
        <Grid item xs key={`${review.reviewId}/revw`}>{review.review}</Grid>
        <Grid item xs key={`${review.reviewId}/time`}>{review.timestamp}</Grid>
      </Grid>
    </Grid>
  )
}

export default ReviewListComponent;
