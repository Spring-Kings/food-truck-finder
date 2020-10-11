"use strict";
import React from 'react'
import Form from "../components/Form";
import {AxiosResponse} from 'axios'
import {Grid} from '@material-ui/core';

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
            <Grid container direction="column" justify="center" xs={4}>
                <h1>Register</h1>
                <Form elementNames={["Username", "Password", "Email"]}
                      submitUrl={'/register'}
                      onSuccessfulSubmit={this.onSubmit}/>

                <p>{this.state.resultText}</p>
            </Grid>

        )
    }

    onSubmit = (formData: any, response: AxiosResponse<any>) => {
        this.setState({resultText: JSON.stringify(response.data)});
    }
}

function RegisterPage() {
    return (
        <RegisterPageComponent/>
    )
}

export default RegisterPage;