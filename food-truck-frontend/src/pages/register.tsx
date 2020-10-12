import CoolLayout from '../components/CoolLayout'
import React from 'react'
import Form from "../components/Form";
import {AxiosResponse} from 'axios'
import {Grid, TextField} from '@material-ui/core';

type State = {
    resultText: string
}

class RegisterPageComponent extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {resultText: ""}
    }

    render() {
        return (
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <h1>Register</h1>
                </Grid>
                <Grid item>
                    <Form submitUrl={'/register'} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
                        <TextField label="Username" name="Username" variant="outlined"/>
                        <TextField label="Password" name="Password" type="password" variant="outlined"/>
                        <TextField label="Email" name="Email" variant="outlined"/>
                    </Form>
                </Grid>
                <Grid item>
                    <p>{this.state.resultText}</p>
                </Grid>

            </Grid>

        )
    }

    onSubmit = (formData: any, response: AxiosResponse<any>) => {
        this.setState({resultText: response.data});
    }

    onFail = (formData: any, err: any) => {
        let text = "Failed to register";
        if (err.response)
            text += ": " + err.response;
        this.setState({resultText: text});
    }
}

function RegisterPage() {
    return (
        <CoolLayout>
            <RegisterPageComponent/>
        </CoolLayout>
    )
}

export default RegisterPage;