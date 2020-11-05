import { Slider } from "@material-ui/core";
import React, {Component} from "react";
import Form from "../Form";

type RecommendedTruckProps = {};
type RecommendedTruckState = {
    acceptibleRadius : number;
    priceRating : number;
    foodCategories : string;
    menuItems : string[];
};

class RecommendedTrucksForm extends Component<RecommendedTruckProps, RecommendedTruckState> {
    constructor(props: RecommendedTruckProps) {
        super(props);
    }

    render() {
        return (
            <Form
                submitUrl={`/url`}
            >
                <Slider name="acceptibleRadius" />
                <Rating
            </Form>
        )
    }
}