import React, { Component } from 'react';
import {Grid, TextField, Typography} from "@material-ui/core";
import {AxiosResponse} from "axios";
import Form from "./Form";
import Router from "next/router";

type State = {
  result: string
}

class CreateTruckForm extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      result: ""
    };
  }

  render() {
    return (
      <Grid container direction="column" justify="center" xs={2}>
        <Typography variant="h4">Create Truck</Typography>
        <Form submitUrl={'/truck/create'}
              onSuccessfulSubmit={this.onSubmit}
              onFailedSubmit={this.onFail}>
          <TextField label="Truck Name" name="truckName"/>
        </Form>
        <br/>
        {this.state.result}
      </Grid>
    );
  }

  onSubmit = (formData: any, response: AxiosResponse) => {
    this.setState({result: `Created truck with id: ${response.data.id}`});
    Router.replace(`/truck/${response.data.id}`);
  }

  onFail = (formData: any, response: any) => {
    this.setState({result: `Failed to create truck: ${JSON.stringify(response)}`});
  }
}

export default CreateTruckForm;