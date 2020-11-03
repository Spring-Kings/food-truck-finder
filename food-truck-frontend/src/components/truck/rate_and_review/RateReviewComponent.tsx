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
import { getSaveReviewUrl } from "../../../api/RateReview";
import NotFound from "../../NotFound";
import getUserInfo, { UserInfo } from "../../../util/token";
import HiddenAttributeForm from "../../util/HiddenAttributeForm";
import { MoneyRating, StarRating } from "./ratings";

interface RateProps {
  truckId: number;
}

export interface RateState {
  review: Review;
  user: UserInfo | null | undefined;
  extended: boolean;
}

/** Number of rows for the review field */
const NUM_ROWS = 5;

class RateReviewComponent extends Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props);

    this.state = {
      review: emptyReview(-1, this.props.truckId),
      user: undefined,
      extended: false,
    };
    this.switchExtended = this.switchExtended.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  componentDidMount() {
    let user: UserInfo | null = getUserInfo();
    if (user !== null) {
      this.setState({
        review: {
          ...this.state.review,
          userId: user.userID,
        },
        user,
      });
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
                value={this.state.extended}
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
            ]}>
            <StarRating name="score" onChange={(_: any, value: number | null) => this.changeRating(value, "starRating")} />
            <MoneyRating name="costRating" onChange={(_: any, value: number | null) => this.changeRating(value, "costRating")} />
            {this.state.extended ? (
              <TextField
                label="Review"
                variant="outlined"
                name="reviewText"
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
      [which]: newRating
    });
  }

  private switchExtended(_: any, checked: boolean) {
    this.setState({
      extended: checked,
    });
  }
}

export default RateReviewComponent;
