import CoolLayout from '../components/CoolLayout'
import React from 'react'
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
        <Form submitUrl={"/register"} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
          <TextField label="Username" name="username" variant="outlined" />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
          />
          <TextField label="Email" name="email" variant="outlined" />
          <br/>
          <Typography>Owner Account?</Typography>
          <Switch value={this.state.isOwner} onChange={this.toggleOwner} name="isOwner" />
        </Form>

        <p>{this.state.resultText}</p>
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
    var isOwner: boolean = this.state.isOwner;
    this.setState({ isOwner });
  }
}

function RegisterPage() {
  return (
    <CoolLayout>
      <RegisterPageComponent/>
    </CoolLayout>
  );
}

export default RegisterPage;
