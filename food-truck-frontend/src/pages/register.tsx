import React from 'react'
import Form from "../components/Form";
import {AxiosResponse} from "axios";
import {Box, Grid, Switch, TextField, Typography,} from "@material-ui/core";
import LinkButton from "../components/layout/LinkButton";

type State = {
  resultText: string;
  owner: boolean;
};

class RegisterPageComponent extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {resultText: "", owner: false};
    this.toggleOwner = this.toggleOwner.bind(this);
  }

  render() {
    return (
      <Grid container direction="column" justify="center">
        <Grid item>
          <Typography variant="h2">Register</Typography>
        </Grid>
        <Grid item>
          <Form submitUrl={"/register"} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
            <TextField label="Username" name="username"/>
            <TextField
              label="Password"
              name="password"
              type="password"
            />
            <TextField label="Email" name="email"/>
            <Typography>Owner Account?</Typography>
            <Switch value={this.state.owner} onChange={this.toggleOwner} name="owner"/>
          </Form>
          <Grid item>
            <Box py={2}>
              <LinkButton url="/login" text="Already have an account? Login here."/>
            </Box>
          </Grid>
          <Grid item>
            <Box py={2}>
              <Typography variant="h6">{this.state.resultText}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  onSubmit = (formData: any, response: AxiosResponse<any>) => {
    this.setState({ resultText: JSON.stringify(response.data) });
  };

  onFail = (formData: any, err: any) => {
    let text = "Failed to register";
    if (err.response)
      text += ": " + err.response;
    this.setState({resultText: text});
  }

  private toggleOwner() {
    const isOwner: boolean = this.state.owner;
    this.setState({owner: isOwner});
  }
}

function RegisterPage() {
  return (
    <RegisterPageComponent/>
  );
}

export default RegisterPage;
