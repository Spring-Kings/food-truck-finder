"use strict";
import React from 'react'
import Form from "../components/Form";

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
            <div>
                <Form elementNames={["Username", "Password", "Email"]}
                      submitUrl={`${process.env.FOOD_TRUCK_API_URL}/register`}
                      submitCallback={this.onSubmit}/>

                <p>{this.state.resultText}</p>
            </div>

        )
    }

    onSubmit = (formData: any, response: Response) => {
        response.text()
            .then(text => {
                this.setState({resultText: text});
            });
    }
}

function RegisterPage() {
    return (
        <RegisterPageComponent/>
    )
}

export default RegisterPage;