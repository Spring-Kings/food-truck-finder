import React from 'react'
import Form from "../components/Form";
import {AxiosResponse} from 'axios';
import {Grid} from '@material-ui/core'

type State = {
    resultText: string
}

class LoginPageComponent extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {resultText: ""}
    }

    render() {
        return (
            <Grid container direction="column" justify="center" xs={4}>
                <h1>Login</h1>
                <Form elementNames={["Username", "Password"]}
                      submitUrl={'/login'}
                      onSuccessfulSubmit={this.onSubmit}
                      onFailedSubmit={this.onFail}
                />

                <p>{this.state.resultText}</p>
            </Grid>

        )
    }

    onSubmit = (formData: any, response: AxiosResponse<any>) => {
        const token = response.headers['token'];
        localStorage.setItem('authToken', token);
        this.setState({resultText: `Set token to ${token}`});
    }
    // TODO: change this once we find the type for the error response
    onFail = (formData: any, response: any) => {
        if (response.response.status === 401)
            this.setState({resultText: "Incorrect username or password."});
        else
            this.setState({resultText: `Failed to login: ${JSON.stringify(response)}`});
    }
}

function LoginPage() {
    return (
        <LoginPageComponent/>
    )
}

export default LoginPage;