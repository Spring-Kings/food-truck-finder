import React, { Component } from 'react'
import {Button, Container, List, ListItem, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotFound from "./NotFound";
import api from "../util/api";

interface TruckState {
  notFound: boolean | null;
  id: number;
  userId: number | null;
  name: string;
  description: string | null;
  priceRating: number | null;
  foodCategory: string | null;
  // menu: string | null;
  textMenu: string | null;
  // schedule: string | null;
}

interface TruckProps {
    truckId: number;
}

class TruckView extends Component<TruckProps, TruckState> {
  constructor(props: TruckProps) {
    super(props);

    this.state = {
      notFound: null,
      id: 0,
      userId: null,
      name: "",
      description: null,
      priceRating: null,
      foodCategory: null,
      textMenu: null,
    };
  }

  componentDidMount() {
    api.get(`/truck/${this.props.truckId}`, {})
      .then(res => this.setState(res ? res.data : null))
      .catch(err => {
        if (err.response) {
          console.log('Got error response code');
        } else if (err.request) {
          console.log('Did not receive Truck response');
        } else {
          console.log(err);
        }
        this.setState(null);
      });
  }

  render() {
    if (!this.state) {
      return (
        <NotFound/>
      );
    } else if (this.state.id < 1) {
      return (
        <Container>
          <CircularProgress/>
        </Container>
      );
    }

    return (
      <>
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
        <Button variant="outlined"
                color="secondary"
                onClick={this.deleteTruck}>
          Delete
        </Button>
      </>
    );
  }

  deleteTruck = () => {
    api.delete(`/truck/delete/${this.state.id}`, {})
      .then(res => this.setState(null))
      .catch(err => {
        if (err.response) {
          console.log('Got error response code for truck deletion');
        } else if (err.request) {
          console.log('Could not delete truck');
        } else {
          console.log(err);
        }
      });
  }
}

export default TruckView;