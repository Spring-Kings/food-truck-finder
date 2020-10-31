import React, { Component } from "react";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Switch,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import { Rating } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Review, { emptyReview } from "../../../domain/truck/Review";
import { getSaveReviewUrl } from "../../../api/RateReview";
import NotFound from "../../NotFound";
import getUserInfo, { UserInfo } from "../../../util/token";
import HiddenAttributeForm from "../../util/HiddenAttributeForm";

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

// Learned from: https://material-ui.com/components/rating/
const MoneyRating = withStyles({
  iconFilled: {
    color: "#00AA00",
  },
  iconHover: {
    color: "#00AA00",
  },
})(Rating);

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
      <Container>
        <Typography variant="h4">Create Review</Typography>
        <TextField
          disabled
          label="Posting As"
          variant="outlined"
          defaultValue={this.state.user.username}
        />
        <FormControlLabel
          label="Leave Extended Review"
          control={
            <Switch
              value={this.state.extended}
              onChange={this.switchExtended}
            />
          }
        />
        <HiddenAttributeForm
          submitUrl={getSaveReviewUrl(this.props.truckId)}
          hiddenAttrs={[
            { name: "userId", defaultValue: this.state.user.userID },
          ]}>
          <Rating name="score" onChange={(_: any, value: number | null) => this.changeRating(value, "starRating")} />
          <MoneyRating name="costRating" icon={<MoneyIcon />} onChange={(_: any, value: number | null) => this.changeRating(value, "costRating")} />
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
      </Container>
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
