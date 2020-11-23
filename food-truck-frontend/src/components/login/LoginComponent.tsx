import React from 'react'
import Form from "../Form";
import {AxiosError, AxiosResponse} from 'axios';
import {Grid, TextField, Typography} from '@material-ui/core'
import {UserData} from "../../redux/user/UserReducer";
import LinkButton from "../layout/LinkButton";
import Router from "next/router";

type State = LoginProps & {
  resultText: string;
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
      <Grid container>
        <Grid item>
          <Typography variant="h2">Login</Typography>
        </Grid>
        <Grid item>
          <Form submitUrl={'/login'} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
            <TextField label="Username" name="username"/>
            <TextField label="Password" name="password" type="password"/>
          </Form>
        </Grid>
        <Grid item>
          <LinkButton url="/register" text="Create an account here."/>
        </Grid>
        <Grid item>
          <Typography variant="h6">{this.state.resultText}</Typography>
        </Grid>
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
    Router.replace('/');
  }

  onFail = (formData: any, err: AxiosError) => {
    if (err.response?.status === 401)
      this.setState({resultText: "Incorrect username or password."});
    else if (err.response)
      this.setState({resultText: 'Failed to login'});
    else
      this.setState({resultText: 'Failed to login: No response.'});
  }
}

export default LoginComponent;