import React from 'react';
import {Grid, Typography} from "@material-ui/core";

interface RatingProps {
  name: string;
  child: JSX.Element;
}

function TruckRatingComponent(props: RatingProps) {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item>
        <Typography variant="subtitle1">{props.name}</Typography>
      </Grid>
      <Grid item>
        {props.child}
      </Grid>
    </Grid>
  );
}

export default TruckRatingComponent;