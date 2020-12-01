import React, {useEffect, useState} from 'react'
import Form from "../Form";
import {AxiosError, AxiosResponse} from 'axios';
import {Grid, TextField, Typography} from '@material-ui/core'
import {UserData} from "../../redux/user/UserReducer";
import LinkButton from "../layout/LinkButton";
import { useRouter } from "next/router";

interface LoginProps {
  data: UserData;
  loadUserFromBackend: () => Promise<void>;
}

function LoginComponent(props: LoginProps) {
  const router = useRouter();
  const [resultText, setResultText]: [string, any] = useState("");

  useEffect(() => {
    if (props.data.username != "") {
      const dashboardType = props.data.owner ? 'owner' : 'user';
      router.push(`/dashboard/${dashboardType}`);
    }
  });

  const onSubmit = (formData: any, response: AxiosResponse<any>) => {
    const token = response.headers['token'];
    localStorage.setItem('authToken', token);
    setResultText(`Successfully logged in. Redirecting to dashboard...`);
    props.loadUserFromBackend().catch(err => console.log(err));
  }

  // TODO: change this once we find the type for the error response
  const onFail = (formData: any, err: AxiosError) => {
    if (err.response?.status === 401) {
      setResultText("Incorrect username or password.");
    } else if (err.response) {
      setResultText("Failed to login");
    } else {
      setResultText("Failed to login: No response.");
    }
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