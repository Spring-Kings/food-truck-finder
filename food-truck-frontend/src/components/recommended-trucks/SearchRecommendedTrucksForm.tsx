import {LatLng} from "@google/maps";
import {Button, Slider, TextField, Typography} from "@material-ui/core";
import React, {ChangeEvent, Component} from "react";
import {DEFAULT_ERR_RESP} from "../../api/DefaultResponses";
import api from "../../util/api";
import { RouteLocation } from "../map/route-map/RouteLocation";
import MultiField from "../util/multi_field";
import {MoneyRating} from "../truck/rate_and_review/ratings";
import { ReactEventAdapter } from "../Form";
import { getNearbyTruckLocationsById } from "../../api/Truck";
import TruckLocationMapComponent from "../map/truck_location_map/TruckLocationMapComponent";

type RecommendedTruckProps = {};
type RecommendedTruckState = {
  location: LatLng;
  acceptibleRadius: number;
  priceRating: number;
  menuItems: string[];
  tags: string[];

  selectedTrucks?: RouteLocation[];
};

const MARKS = [
  {
    value: 0,
    label: "1 mi",
  },
  {
    value: 10,
    label: "10 mi",
  },
  {
    value: 20,
    label: "20 mi",
  },
  {
    value: 30,
    label: "30 mi",
  },
];

class RecommendedTrucksForm extends Component<
  RecommendedTruckProps,
  RecommendedTruckState
> {
  constructor(props: RecommendedTruckProps) {
    super(props);
    this.state = {
      location: { lat: 0, lng: 0 },
      acceptibleRadius: 1,
      priceRating: 3,
      menuItems: [],
      tags: []
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((location) =>
      this.setState({
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
      })
    );
  }

  render() {
    if (this.state.selectedTrucks != undefined)
      return <TruckLocationMapComponent locations={this.state.selectedTrucks} />;

    return (
      <>
        <Typography variant="h6">Acceptable Radius</Typography>
        <Slider
          value={this.state.acceptibleRadius}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          min={0}
          marks={MARKS}
          max={30}
          onChange={(_, val) =>
            this.setState({ acceptibleRadius: this.coerce(val) })
          }
          style={{
            width: 200,
          }}
        />

        <Typography variant="h6">Price Rating</Typography>
        <MoneyRating
          name="priceRating"
          defaultValue={this.state.priceRating}
          onChange={this.changePrice}
        />

        <Typography variant="h6">Food Categories</Typography>
        <MultiField title="Desired Menu Items" name="menuItems" onChange={this.changeItems}/>
        <MultiField title="Desired Truck Tags" name="tags" onChange={this.changeTags} />
        <Button variant="contained" color="primary" onClick={this.submit}>
          Search Trucks
        </Button>
      </>
    );
  }

  coerce = (val: number | number[]) => {
    if (typeof val === "number") {
      return val as number;
    } else {
      return (val as number[])[0];
    }
  };

  changePrice = (_: any, newVal: number | null) => {
    if (newVal !== null) this.setState({ priceRating: newVal });
  };

  changeItems = (data: ReactEventAdapter) => this.setState({ menuItems: data.target.value });
  changeTags = (data: ReactEventAdapter) => this.setState({ tags: data.target.value });

  submit = async () => {
    try {
      let resp: any = await api.request({
        url: "/truck/recommended",
        data: {
            acceptableRadius: this.state.acceptibleRadius,
            priceRating: this.state.priceRating,
            menuItems: this.state.menuItems,
            tags: this.state.tags,
            location: this.state.location,
            numRequested: 10
          },
        method: "POST",
      });
      if (resp.data !== undefined) {
        this.setState({ selectedTrucks: await getNearbyTruckLocationsById(resp.data.map(t => t.id), DEFAULT_ERR_RESP) })
      }

    } catch (err) {
      DEFAULT_ERR_RESP(err);
    }
  };
}

export default RecommendedTrucksForm;
