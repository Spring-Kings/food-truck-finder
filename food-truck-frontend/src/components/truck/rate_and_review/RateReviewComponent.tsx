import React, {Component} from "react";
import {Button, Container, FormControlLabel, Grid, Switch, TextField, Typography,} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Review, {emptyReview, isExtended} from "../../../domain/Review";
import {deleteReview, getSaveReviewUrl, loadReviewFromTruckForUser,} from "../../../api/RateReviewApi";
import NotFound from "../../NotFound";
import loggedInUser, {UserInfo} from "../../../util/token";
import {MoneyRating, StarRating} from "./ratings";
import {DEFAULT_ERR_RESP} from "../../../api/DefaultResponses";
import Router from "next/router";
import Form from "../../Form";

interface RateProps {
  truckId: number;
}

export interface RateState {
  review: Review;
  user: UserInfo | null | undefined;
  old_review_text: string | null;
}

/** Number of rows for the review field */
const NUM_ROWS = 5;

class RateReviewComponent extends Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props);

    this.state = {
      review: emptyReview(-1, this.props.truckId),
      user: undefined,
      old_review_text: ""
    };
    this.switchExtended = this.switchExtended.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  async componentDidMount() {
    let user: UserInfo | null = loggedInUser();
    if (user !== null) {
      let review: Review | null = await loadReviewFromTruckForUser(
        this.props.truckId,
        user.userID,
        DEFAULT_ERR_RESP
      );

      if (review === null)
        this.setState({
          review: {
            ...this.state.review,
            userId: user.userID,
          },
          user,
          old_review_text: "",
        });
      else this.setState({ review: review, user: user, old_review_text: review.review });
    } else
      this.setState({
        user: loggedInUser(),
      });
  }

  render() {
    // Error-handling
    if (this.state.user === undefined)
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    else if (this.state.user === null) return <NotFound />;

    // Generate actual UI
    return (
      <Grid container direction="column">
        <Grid item key="title_reviews">
          <Typography variant="h4">Create Review</Typography>
        </Grid>
        <Grid item key="post_as">
          <TextField
            disabled
            label="Posting As"
            variant="outlined"
            defaultValue={this.state.user.username}
          />
        </Grid>
        <Grid item key="leave_extended">
          <FormControlLabel
            label="Leave Extended Review"
            control={
              <Switch
                value={isExtended(this.state.review)}
                checked={isExtended(this.state.review)}
                onChange={this.switchExtended}
              />
            }
          />
        </Grid>
        <Grid item key="hidden_review_form">
          <Form
            submitUrl={getSaveReviewUrl(this.props.truckId)}
            onSuccessfulSubmit={() => Router.replace(`/truck/reviews/${this.props.truckId}`)}
          >
            <StarRating
              name="score"
              defaultValue={this.state.review.starRating}
            />
            <MoneyRating
              name="costRating"
              defaultValue={this.state.review.costRating}
            />
            {isExtended(this.state.review) &&
            <TextField
                label="Review"
                variant="outlined"
                name="reviewText"
                defaultValue={this.state.review.review}
                multiline
                fullWidth
                rows={NUM_ROWS}
            />
            }
          </Form>
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="secondary" onClick={this.deleteReview}>DELETE REVIEW</Button>
        </Grid>
      </Grid>
    );
  }

  private switchExtended(_: any, checked: boolean) {
    let review_text: string | null = checked ? this.state.old_review_text : null;
    this.setState({
      old_review_text: this.state.review.review,
      review: {
        ...this.state.review,
        review: review_text,
      },
    });
  }

  private deleteReview() {
    if (confirm("Are you sure you want to delete your review?") && deleteReview(this.props.truckId, DEFAULT_ERR_RESP))
      Router.replace(`/truck/reviews/${this.props.truckId}`);
  }
}

export default RateReviewComponent;
