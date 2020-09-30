import React from 'react'
import Form from "../components/Form";

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
            <div>
                <Form elementNames={["Username", "Password"]}
                      submitUrl={`${process.env.FOOD_TRUCK_API_URL}/login`}
                      submitCallback={this.onSubmit}/>

                <p>{this.state.resultText}</p>
            </div>

        )
    }

    onSubmit = (formData: any, response: Response) => {
        response.json()
            .then(json => {
                this.setState({resultText: JSON.stringify(json)});
                if (json.success) {
                    sessionStorage.setItem("token", json.token);
                    sessionStorage.setItem("userId", json.userId);
                }
            });
    }
}

function LoginPage() {
    return (
        <LoginPageComponent/>
    )
}

export default LoginPage;