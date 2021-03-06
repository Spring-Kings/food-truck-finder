import React, {ReactElement} from "react";

import {Card, CardContent, Grid, IconButton} from "@material-ui/core";
import {SimpleTruck} from "../../redux/user/UserReducer";

export interface TruckListProps {
  trucks: SimpleTruck[];
  empty?: ReactElement;
  tail?: ReactElement;

  handleTruckIcon: ReactElement;
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
      <Grid item key={sub.id}>
        <Card>
          <CardContent>
            {sub.name}
            <IconButton onClick={() => this.props.handleTruck(sub.id)}>
              {this.props.handleTruckIcon}
            </IconButton>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default TruckListComponent;
