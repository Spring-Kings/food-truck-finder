import React, { Component } from 'react'
import {Container} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotFound from "./NotFound";
import api from "../util/api";

interface TruckState {
  notFound: boolean | null;
  id: number;
  name: string;
  description: string | null;
  priceRating: number | null;
  foodCategory: string | null;
  // TODO add more here
}

interface TruckProps {
    truckId: number;
}

class Truck extends Component<TruckProps, TruckState> {
  constructor(props: TruckProps) {
    super(props);

    this.state = {
      notFound: null,
      id: 0,
      name: "",
      description: null,
      priceRating: null,
      foodCategory: null,
    };
  }

  componentDidMount() {
    api.get(`/truck/${this.props.truckId}`, {})
      .then(res => this.setState(res.data))
      .catch(err => {
        if (err.response) {
          console.log('Got error response code');
        } else if (err.request) {
          console.log('Did not receive Truck response');
        } else {
          console.log(err);
        }
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
      <Container>
        <div>
          Truck Name: {this.state.name}
        </div>
        <div>
          Truck Description: {this.state.description}
        </div>
      </Container>
    );
  }
}

export default Truck;