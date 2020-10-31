import React, { Component } from "react";
import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
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

class RateReviewComponent extends Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props);

    this.state = {
      review: emptyReview(-1, this.props.truckId),
      user: undefined,
      extended: false,
    };
  }

  componentDidMount() {
    let user: UserInfo | null = getUserInfo();
    if (user !== null) {
      this.setState({
        review: {
          ...this.state.review,
          userId: user.userID
        },
        user
      })
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
      <>
        <Typography variant="h4">Create Review</Typography>
        <TextField disabled label="Posting As" variant="outlined" defaultValue={this.state.user.username} />
        <FormControlLabel label="Leave Extended Review" control={<Switch value={this.state.extended} />} />
        <HiddenAttributeForm
          submitUrl={getSaveReviewUrl(this.props.truckId)}
          hiddenAttrs={[
            { key: "userId", value: this.state.user.userID },
            { key: "truckId", value: this.props.truckId },
          ]}
        >
          <Rating />
          {this.state.extended ? (
            <TextField label="Review" variant="outlined" name="truckName" value={this.state.review.review} />
          ) : null}
        </HiddenAttributeForm>
      </>
    );
  }
}

export default RateReviewComponent;
