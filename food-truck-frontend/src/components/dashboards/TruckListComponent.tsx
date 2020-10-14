import React, { ReactElement } from "react";
import Router from "next/router";

import { Grid, Card, CardContent, IconButton, Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { SimpleTruck } from "../../redux/user/UserReducer";

export interface TruckListProps {
  trucks: SimpleTruck[];
  empty?: ReactElement;
  tail?: ReactElement;
  handleTruck: (id: number) => void;
}

class TruckListComponent extends React.Component<TruckListProps, any> {
  constructor(props: TruckListProps) {
    super(props);
  }

  render() {
    return (
      <Grid container direction="column" style={{ overflow: "auto" }}>
        {this.props.trucks.length > 0
          ? this.props.trucks.flatMap((truck) => this.createTruckEntry(truck))
          : this.props.empty}
        {this.props.tail ? (
          <Grid item xs>
            {this.props.tail}
          </Grid>
        ) : null}
      </Grid>
    );
  }

  private createTruckEntry(sub: SimpleTruck) {
    return (
      <Grid item xs>
        <Card>
          <CardContent>
            {sub.name}
            <IconButton onClick={() => this.props.handleTruck(sub.id)}>
              <Edit />
            </IconButton>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default TruckListComponent;