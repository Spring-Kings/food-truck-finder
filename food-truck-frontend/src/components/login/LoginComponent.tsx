import React from 'react'
import Form from "../Form";
import {AxiosResponse} from 'axios';
import {Grid, TextField, Typography} from '@material-ui/core'
import {UserData} from "../../redux/user/UserReducer";

type State = {
  resultText: string;
  data: UserData;
  loadUserFromBackend: () => Promise<void>;
}

interface LoginProps {
  data: UserData;
  loadUserFromBackend: () => Promise<void>;
}

class LoginComponent extends React.Component<LoginProps, State> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      resultText: "",
      data: props.data,
      loadUserFromBackend: props.loadUserFromBackend
    }
  }

  render() {
    return (
      <Grid container direction="column" justify="center" xs={4}>
        <Typography variant="h1">Login</Typography>
        <Form submitUrl={'/login'} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
          <TextField label="Username" variant="outlined" name="username"/>
          <TextField label="Password" variant="outlined" name="password" type="password"/>
        </Form>

        <p>{this.state.resultText}</p>
      </Grid>
    )
  }

  onSubmit = (formData: any, response: AxiosResponse<any>) => {
    const token = response.headers['token'];
    localStorage.setItem('authToken', token);
    this.setState({
      ...this.state,
      resultText: `Set token to ${token}`
    });
    this.state.loadUserFromBackend().catch(err => console.log(err));
  }
  // TODO: change this once we find the type for the error response
  onFail = (formData: any, response: any) => {
    if (response.response.status === 401)
      this.setState({resultText: "Incorrect username or password."});
    else
      this.setState({resultText: `Failed to login: ${JSON.stringify(response)}`});
  }
}

export default LoginComponent;