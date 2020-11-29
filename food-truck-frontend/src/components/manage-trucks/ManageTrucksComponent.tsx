import React from "react";
import Router from "next/router";

import {Button, Card, CircularProgress, Container, Grid, Typography,} from "@material-ui/core";

import api from "../../util/api";
import Truck from "../../domain/Truck";

interface ManageTruckProps {}
interface ManageTruckState {
  trucks: Truck[] | undefined;
  errorMsg: string | undefined;
}

class ManageTrucksComponent extends React.Component<
  ManageTruckProps,
  ManageTruckState
> {
  constructor(props: ManageTruckProps) {
    super(props);
    this.state = {
      trucks: undefined,
      errorMsg: undefined,
    };
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    api
      .request({
        url: `/truck/owner`,
        method: "GET",
      })
      .then((response) => this.setState({ trucks: response.data }))
      .catch((err) => {
        console.log(err);
        this.setState({ errorMsg: err });
      });
  }

  render() {
    if (this.state.trucks === undefined) return <CircularProgress />;
    else if (this.state.errorMsg)
      return (
        <Container>
          <Typography variant="h2">ERROR</Typography>
          <Typography>{this.state.errorMsg}</Typography>
        </Container>
      );
    return (
      <Container>
        <Typography variant="h2">TRUCKS</Typography>
        <Grid container direction="column">
          {this.state.trucks.length > 0 ? (
            this.state.trucks.flatMap((truck) => this.renderRow(truck))
          ) : (
            <Grid item>
              <Card>No trucks</Card>
            </Grid>
          )}
        </Grid>
      </Container>
    );
  }

  private renderRow(truck: Truck) {
    return (
      <Grid item xs key={truck.id}>
        <Grid container direction="row">
          <Grid item xs>
            <Card>
              <Typography variant="h6">{truck.name}</Typography>
            </Card>
          </Grid>
          <Grid item xs>
            <Card>
              <Button
                variant="contained"
                onClick={() => Router.replace(`/truck/${truck.id}`)}
              >
                VIEW DETAILS
              </Button>
            </Card>
          </Grid>
          <Grid item xs>
            <Card>
              <Button
                variant="contained"
                onClick={() => Router.replace(`/manage-routes/${truck.id}`)}
              >
                MANAGE ROUTES
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default ManageTrucksComponent;
