import React from 'react';
import {Grid, Typography} from "@material-ui/core";

interface KVGridProps {
  key: string;
  value: string | number | null;
  direction?: "row";
}

function KeyValueGrid(props: KVGridProps) {
  const direction = props.direction ? props.direction : "column";
  return (
    <Grid container direction={direction} justify="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item>
        <Typography variant="subtitle1">{props.key}</Typography>
      </Grid>
      <Grid item>
        {props.value}
      </Grid>
    </Grid>
  );
}

export default KeyValueGrid;