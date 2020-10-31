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
import Review, { emptyReview } from "../../../domain/truck/Review";
import { loadReviewsByTruck } from "../../../api/RateReview";
import { DEFAULT_ERR_KICK } from "../../../api/DefaultResponses";
import NotFound from "../../NotFound";
import getUserInfo, { UserInfo } from "../../../util/token"
import Form from "../../Form";

interface RateProps {
  truckId: number;
}

export interface RateState {
  review: Review;
  user: UserInfo | null | undefined;
}

class RateReviewComponent extends Component<RateProps, RateState> {

  constructor(props: RateProps) {
    super(props);

    this.state = {
      review: emptyReview(-1, this.props.truckId),
      userInfo: undefined;
    };
    this.setState = this.setState.bind(this);
  }

  async componentDidMount() {
    this.setState({
      user: getUserInfo()
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
    else if (this.state.user === null)
      return (<NotFound />);

    // Generate actual UI
    return <Form></Form>;
  }
}

export default RateReviewComponent;
