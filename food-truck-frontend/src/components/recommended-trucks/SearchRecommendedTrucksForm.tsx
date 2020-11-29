import {LatLng} from "@google/maps";
import {Button, Grid, Slider, Typography} from "@material-ui/core";
import React, {Component} from "react";
import {DEFAULT_ERR_RESP} from "../../api/DefaultResponses";
import api from "../../util/api";
import {RouteLocation} from "../map/route-map/RouteLocation";
import MultiField from "../util/multi_field";
import {MoneyRating} from "../truck/rate_and_review/ratings";
import {ReactEventAdapter} from "../Form";
import {getNearbyTruckLocationsById} from "../../api/Truck";
import TruckLocationMapComponent from "../map/truck_location_map/TruckLocationMapComponent";

type RecommendedTruckProps = {};
type RecommendedTruckState = {
  location: LatLng;
  acceptableRadius: number;
  priceRating: number;
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
      location: {lat: 0, lng: 0},
      acceptableRadius: 1,
      priceRating: 3,
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
      <Grid container alignItems="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="h4">Search Recommended Trucks</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">Acceptable Radius</Typography>
        </Grid>
        <Grid item>
          <Slider
            value={this.state.acceptableRadius}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            min={0}
            marks={MARKS}
            max={30}
            onChange={(_, val) =>
              this.setState({acceptableRadius: this.coerce(val)})
            }
            style={{
              width: 200,
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6">Price Rating</Typography>
        </Grid>
        <Grid item>
          <MoneyRating
            name="priceRating"
            defaultValue={this.state.priceRating}
            onChange={this.changePrice}
          />
        </Grid>
        <Grid item>
          <Typography variant="h4">Food Categories</Typography>
        </Grid>
        <Grid item>
          <MultiField title="Desired Truck Tags" name="tags" onChange={this.changeTags}/>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={this.submit}>
            Search Trucks
          </Button>
        </Grid>
      </Grid>
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

  changeTags = (data: ReactEventAdapter) => this.setState({ tags: data.target.value });

  submit = async () => {
    try {
      let resp: any = await api.request({
        url: "/truck/recommended",
        data: {
            acceptableRadius: this.state.acceptableRadius,
            priceRating: this.state.priceRating,
            tags: this.state.tags,
            truckIds: [],
            location: this.state.location,
            active: true,
            numRequested: 10
          },
        method: "POST",
      });
      if (resp.data !== undefined) {
        this.setState({ selectedTrucks: await getNearbyTruckLocationsById(resp.data.map((t: any) => t.id), DEFAULT_ERR_RESP) })
      }

    } catch (err) {
      DEFAULT_ERR_RESP(err);
    }
  };
}

export default RecommendedTrucksForm;
