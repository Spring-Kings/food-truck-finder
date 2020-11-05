import { Slider, TextField, Typography } from "@material-ui/core";
import React, { Component } from "react";
import Form from "../Form";
import { MoneyRating } from "../truck/rate_and_review/ratings";
import MultiField from "./multi_field";

type RecommendedTruckProps = {};
type RecommendedTruckState = {
  acceptibleRadius: number;
  priceRating: number;
  foodCategories: string;
  menuItems: string[];
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
  }
];

class RecommendedTrucksForm extends Component<
  RecommendedTruckProps,
  RecommendedTruckState
> {
  constructor(props: RecommendedTruckProps) {
    super(props);
    this.state = {
      acceptibleRadius: 1,
      priceRating: 3,
      foodCategories: "",
      menuItems: [],
    };
    this.setState = this.setState.bind(this);
  }

  render() {
    return (
      <Form submitUrl={`/url`}>
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
        <MoneyRating name="priceRating" defaultValue={this.state.priceRating} />

        <Typography variant="h6">Food Categories</Typography>
        <TextField name="foodCategories" value={this.state.foodCategories} />

        <MultiField title="Desired Menu Items" name="menuItems" />
      </Form>
    );
  }

  coerce = (val: number | number[]) => {
    if (typeof val === "number") {
      return val as number;
    } else {
      return (val as number[])[0];
    }
  };
}

export default RecommendedTrucksForm;
