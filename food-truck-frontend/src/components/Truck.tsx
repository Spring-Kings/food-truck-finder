import React, { Component } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import {Container} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotFound from "./NotFound";

interface TruckState {
  notFound: boolean | null;
  truckId: number;
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

    this.setState({
      notFound: null,
      truckId: 0,
      name: "",
      description: null,
      priceRating: null,
      foodCategory: null,
    });
  }

  componentDidMount() {
    const url = `${process.env.FOOD_TRUCK_API_URL}/truck/${this.props.truckId}`;
    let config: AxiosRequestConfig = {
      params: {
        truckId: this.props.truckId
      }
    };

    axios.get(url, config)
      .then(res => this.setState(res.data))
      .catch(err => {
        if (err.response) {
          console.log('Got error response code');
        } else if (err.request) {
          console.log('Did not receive Truck response');
        } else {
          console.log(err);
        }

        this.setState({
          notFound: true,
          truckId: 0,
          name: "",
          description: null,
          priceRating: null,
          foodCategory: null,
        });
      });
  }

  render() {
    if (this.state.notFound === true) {
      return (
        <NotFound/>
      );
    } else if (this.state.truckId < 1 && !this.state.notFound) {
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