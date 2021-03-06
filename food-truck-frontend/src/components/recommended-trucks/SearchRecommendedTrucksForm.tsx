import {LatLng} from "@google/maps";
import {Button, Grid, Slider, Typography} from "@material-ui/core";
import React, {Component} from "react";
import {DEFAULT_ERR_RESP} from "../../api/DefaultResponses";
import api from "../../util/api";
import MultiField from "../util/multi_field";
import {MoneyRating} from "../truck/rate_and_review/ratings";
import {ReactEventAdapter} from "../Form";
import TruckLocationMapComponent from "../map/truck_location_map/TruckLocationMapComponent";
import {getLocationFromStorage} from "../../util/position";
import {RecommendedSimpleTruck} from "../../redux/user/UserReducer";
import {backendToFrontend, RouteLocation} from "../../domain/RouteLocation";

type RecommendedTruckProps = {};
type RecommendedTruckState = {
  location: LatLng;
  acceptableRadius: number;
  priceRating: number;
  tags: string[];
  selectedTrucks?: RouteLocation[] | null;
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
    this.setState({
      location: getLocationFromStorage()
    });
  }

  getRouteLocations(trucks: RecommendedSimpleTruck[]) {
    return trucks.map((t) => backendToFrontend(t.loc, t.truck.id))
  }

  render() {
    if (this.state.selectedTrucks != undefined)
      return <TruckLocationMapComponent locations={this.state.selectedTrucks} allowChangeLocation={true} />;

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
            truckIds: localStorage.getItem("prevSearch") ? JSON.parse(`${localStorage.getItem("prevSearch")}`) : [],
            location: this.state.location,
            active: true,
            numRequested: 10
          },
        method: "POST",
      });
      if (resp.data !== undefined) {
        this.setState({selectedTrucks: this.getRouteLocations(resp.data)}, () => console.log(this.state.selectedTrucks))
      }

    } catch (err) {
      DEFAULT_ERR_RESP(err);
    }
  };
}

export default RecommendedTrucksForm;
