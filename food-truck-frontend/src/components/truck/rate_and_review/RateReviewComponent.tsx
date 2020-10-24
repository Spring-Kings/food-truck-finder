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

interface RateProps {
    truckId: number;
}

interface RateState {
    review: Review;
}

class RateReviewComponent extends Component<RateProps, RateState> {
  constructor(props: RateProps) {
    super(props);

    this.state = {
        review: 
    };
  }

  async componentDidMount() {
    //
  }

  render() {
    if (!this.state) {
      return <NotFound />;
    } else if (this.state.id < 1) {
      return (
        <Container>
          <CircularProgress />
        </Container>
      );
    }

    return (
      <Grid container direction="row">
        <Grid item xs>
        <Typography variant="h4">{this.state.name}</Typography>
        <List>
          <ListItem>
            Truck Description: {this.state.description}
          </ListItem>
          <ListItem>
            Price Rating: {this.state.priceRating}
          </ListItem>
          <ListItem>
            Food Category: {this.state.foodCategory}
          </ListItem>
          <ListItem>
            Text Menu: {this.state.textMenu}
          </ListItem>
        </List>
        {userCanEditTruck(this.state.userId) &&
          <Button variant="outlined"
                  color="primary"
                  onClick={this.editTruck}>
            Edit
          </Button>
        }        </Grid>
        <Grid item xs>
          <TruckRouteMapComponent routePts={this.state.routePts} />
        </Grid>
      </Grid>
    );
  }

  editTruck = () => {
    Router.replace(`/truck/edit/${this.state.id}`);
  };
}

export default RateReviewComponent;
