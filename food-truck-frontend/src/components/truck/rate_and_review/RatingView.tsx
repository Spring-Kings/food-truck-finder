import {MoneyRating, StarRating} from "./ratings";
import {Grid, Typography} from "@material-ui/core";
import React from "react";

type State = {

}

type Props = {
    starRating: number,
    costRating: number
}

class RatingView extends React.Component<Props, State> {

    render() {
        return <Grid container>
            <Grid item xs key={"star"}>
                <Typography variant="h6">Quality:</Typography>
                <StarRating readOnly precision={0.1} disabled value={this.props.starRating}/>
            </Grid>
            <Grid item xs key={"`cost"}>
                <Typography variant="h6">Value:</Typography>
                <MoneyRating readOnly precision={0.1} disabled value={this.props.costRating}/>
            </Grid>
        </Grid>;
    }
}

export default RatingView