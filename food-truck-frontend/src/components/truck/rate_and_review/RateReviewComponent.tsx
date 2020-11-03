import React, { Component } from "react";
import {
  Container,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Review, { emptyReview } from "../../../domain/truck/Review";
import {
  getSaveReviewUrl,
  loadReviewFromTruckForUser,
} from "../../../api/RateReview";
import NotFound from "../../NotFound";
import getUserInfo, { UserInfo } from "../../../util/token";
import HiddenAttributeForm from "../../util/HiddenAttributeForm";
import { MoneyRating, StarRating } from "./ratings";
import { DEFAULT_ERR_RESP } from "../../../api/DefaultResponses";

interface RateProps {
  truckId: number;
}

export interface RateState {
  review: Review;
  user: UserInfo | null | undefined;
}

/** Number of rows for the review field */
const NUM_ROWS = 5;

class RateReviewComponent extends Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props);

    this.state = {
      review: emptyReview(-1, this.props.truckId),
      user: undefined,
    };
    this.switchExtended = this.switchExtended.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  async componentDidMount() {
    let user: UserInfo | null = getUserInfo();
    if (user !== null) {
      let review: Review | null = await loadReviewFromTruckForUser(
        this.props.truckId,
        user.userID,
        DEFAULT_ERR_RESP
      );
      console.log(review);
      if (review === null)
        this.setState({
          review: {
            ...this.state.review,
            userId: user.userID,
          },
          user,
        });
      else this.setState({ review: review, user: user });
    } else
      this.setState({
        user: getUserInfo(),
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
                defaultChecked={this.state.review.extended}
                value={this.state.review.extended}
                onChange={this.switchExtended}
              />
            }
          />
        </Grid>
        <Grid item key="hidden_review_form">
          <HiddenAttributeForm
            submitUrl={getSaveReviewUrl(this.props.truckId)}
            hiddenAttrs={[
              { name: "userId", defaultValue: this.state.user.userID },
            ]}
          >
            <StarRating
              name="score"
              defaultValue={this.state.review.starRating}
              onChange={(_: any, value: number | null) =>
                this.changeRating(value, "starRating")
              }
            />
            <MoneyRating
              name="costRating"
              defaultValue={this.state.review.costRating}
              onChange={(_: any, value: number | null) =>
                this.changeRating(value, "costRating")
              }
            />
            {this.state.review.extended ? (
              <TextField
                label="Review"
                variant="outlined"
                name="reviewText"
                defaultValue={this.state.review.review}
                multiline
                fullWidth
                rows={NUM_ROWS}
                value={this.state.review.review}
              />
            ) : null}
          </HiddenAttributeForm>
        </Grid>
      </Grid>
    );
  }

  private changeRating(providedRating: number | null, which: string) {
    let newRating: number = 0;
    if (providedRating !== null) newRating = providedRating;

    this.setState({
      ...this.state,
      [which]: newRating,
    });
  }

  private switchExtended(_: any, checked: boolean) {
    this.setState({
      review: {
        ...this.state.review,
        extended: checked
      }
    });
  }
}

export default RateReviewComponent;
