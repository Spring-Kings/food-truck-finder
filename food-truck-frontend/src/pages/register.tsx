"use strict";
import React from "react";
import Form from "../components/Form";
import { AxiosResponse } from "axios";
import {
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";

type State = {
  resultText: string;
  isOwner: boolean;
};

class RegisterPageComponent extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { resultText: "", isOwner: false };
    this.toggleOwner = this.toggleOwner.bind(this);
  }

  render() {
    return (
      <Grid container direction="column" justify="center" xs={4}>
        <h1>Register</h1>
        <Form submitUrl={"/register"} onSuccessfulSubmit={this.onSubmit}>
          <TextField label="Username" name="Username" variant="outlined" />
          <TextField
            label="Password"
            name="Password"
            type="password"
            variant="outlined"
          />
          <TextField label="Email" name="Email" variant="outlined" />
          <Switch value={this.state.isOwner} onChange={this.toggleOwner} name="isOwner" />
        </Form>

        <p>{this.state.resultText}</p>
      </Grid>
    );
  }

  onSubmit = (formData: any, response: AxiosResponse<any>) => {
    this.setState({ resultText: JSON.stringify(response.data) });
  };

  private toggleOwner() {
      var isOwner: boolean = this.state.isOwner;
      this.setState({ isOwner });
  }
}

function RegisterPage() {
  return <RegisterPageComponent />;
}

export default RegisterPage;
