import React, {useEffect, useState} from 'react'
import Form from "../Form";
import {AxiosResponse} from 'axios';
import {Grid, TextField, Typography} from '@material-ui/core'
import {UserData} from "../../redux/user/UserReducer";
import LinkButton from "../layout/LinkButton";
import Router from "next/router";

interface LoginProps {
  data: UserData;
  loadUserFromBackend: () => Promise<void>;
}

function LoginComponent(props: LoginProps) {
  const [resultText, setResultText]: [string, any] = useState("");

  useEffect(() => {
    if (props.data.username != "") {
      const dashboardType = props.data.owner ? 'owner' : 'user';
      Router.replace(`/dashboard/${dashboardType}`);
    }
  });

  const onSubmit = (formData: any, response: AxiosResponse<any>) => {
    const token = response.headers['token'];
    localStorage.setItem('authToken', token);
    setResultText(`Set token to ${token}`);
    props.loadUserFromBackend().catch(err => console.log(err));
  }

  // TODO: change this once we find the type for the error response
  const onFail = (formData: any, response: any) => {
    if (response.response.status === 401)
      setResultText("Incorrect username or password.");
    else
      setResultText(`Failed to login: ${JSON.stringify(response)}`);
  }

  return (
    <Grid container>
      <Grid item>
        <Typography variant="h2">Login</Typography>
      </Grid>
      <Grid item>
        <Form submitUrl={'/login'} onSuccessfulSubmit={onSubmit} onFailedSubmit={onFail}>
          <TextField label="Username" name="username"/>
          <TextField label="Password" name="password" type="password"/>
        </Form>
      </Grid>
      <Grid item>
        <LinkButton url="/register" text="Create an account here."/>
      </Grid>
      <Grid item>
        <Typography variant="h6">{resultText}</Typography>
      </Grid>
    </Grid>
  )
}

export default LoginComponent;